const connection = require("../config/dbConnection");
require("dotenv").config();
// const https = require("https");
const axios = require("axios");
const { response } = require("express");

const headers = {
  Authorization: `Token token=${process.env.CRM_TOKEN}`,
  "Content-Type": "application/json",
};

// const options = {
//   hostname: "domain.freshsales.io",
//   path: "/api/contacts",
//   method: "POST",
//   headers: headers,
// };
const createContacts = async (req, res) => {
  const { first_name, last_name, email, mobile_number, data_store } = req.body;
  if (!first_name || !last_name || !email || !mobile_number || !data_store) {
    res.status(404).send({ message: "Please fill all the required fields" });
  }

  if (data_store === "DATABASE") {
    await connection.query(
      `INSERT INTO contacts (first_name,last_name,email,mobile_number) VALUES ('${first_name}','${last_name}','${email}','${mobile_number}')`,
      (err, result) => {
        if (err) {
          res.status(500).send({ message: err.message });
        } else {
          res.status(201).send({ message: "Contact created successfully" });
        }
      }
    );
  } else if (data_store === "CRM") {
    const data = {
      contact: {
        first_name: first_name,
        last_name: last_name,
        mobile_number: mobile_number,
        email: email,
      },
    };

    const URL = "https://domain.freshsales.io/api/contacts";

    try {
      const response = await axios.post(URL, { data }, { headers });

      res.status(response.statusCode).send(response.data);
    } catch (error) {
      res.status(response.statusCode).send({ message: error.message });
    }
  }
};

const getContacts = async (req, res) => {
  const { contact_id, data_store } = req.body;
  if (!contact_id || !data_store) {
    res.status(404).send({ message: "Please fill all the required fields" });
  }

  if (data_store === "DATABASE") {
    await connection.query(
      `SELECT * FROM contacts WHERE id = '${contact_id}'`,
      (err, result) => {
        if (err) {
          res.status(500).send({ message: err.message });
        } else {
          res.status(200).json(result);
        }
      }
    );
  } else if (data_store === "CRM") {
    const data = {
      contact: {
        id: contact_id,
      },
    };
    const url = `https://domain.freshsales.io/api/contacts/${contact_id}?include=sales_accounts`;
    try {
      const response = await axios.get(url, { data }, { headers });
      console.log(response.data);
      res.send(response.data);
    } catch (error) {
      console.error(error);
      res.status(500).send("Server error");
    }
  }
};

const updateContacts = async (req, res) => {
  const { contact_id, new_email, new_mobile_number, data_store } = req.body;

  if (!contact_id || !new_email || !new_mobile_number || !data_store) {
    res.status(404).send({ message: "Please fill all the required fields" });
  }

  if (data_store === "DATABASE") {
    await connection.query(
      `UPDATE contacts SET email='${new_email}',mobile_number='${new_mobile_number}' WHERE id='${contact_id}'`,
      (err, result) => {
        if (err) {
          res.status(500).send({ message: err.message });
        } else {
          res.status(200).send({ message: "Contact updated successfully" });
        }
      }
    );
  } else if (data_store === "CRM") {
    const url = `https://domain.freshsales.io/api/contacts/${contact_id}`;

    const data = {
      contact: {
        email: new_email,
        mobile_number: new_mobile_number,
      },
    };

    try {
      const response = await axios.put(url, { data }, { headers });
      console.log(response.data);
      res.send(response.data);
    } catch (err) {
      console.log(response);
      res.status(500).send({ message: "Internal Server Error" });
    }
  }
};

const deleteContacts = async (req, res) => {
  const { contact_id, data_store } = req.body;

  if (!contact_id || !data_store) {
    res.status(404).send({ message: "Please fill all the required fields" });
  }
  if (data_store === "DATABASE") {
    await connection.query(
      `DELETE FROM contacts WHERE id='${contact_id}'`,
      (err, result) => {
        if (err) {
          res.status(500).send({ message: err.message });
        } else {
          res.status(200).send({ message: "Contact deleted successfully" });
        }
      }
    );
  } else if (data_store === "CRM") {
    const url = `https://domain.freshsales.io/api/contacts/${contact_id}`;

    try {
      const response = await axios.delete(url, { headers });
      res.status(200).send(response.data);
    } catch (err) {
      res.status(500).send({ message: "Internal Server Error" });
    }
  }
};

module.exports = {
  createContacts,
  updateContacts,
  deleteContacts,
  getContacts,
};
