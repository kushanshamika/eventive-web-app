import { useState, useEffect, React } from "react";
import Header from "./common/header";
import Notiflix from "notiflix";
import Swal from "sweetalert2";
import {
  Col,
  Container,
  Row,
  Badge,
  Form,
  Button,
  Alert,
} from "react-bootstrap";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import getUrl from "../../utils/routes";
import axios from "axios";

const Users = () => {
  const [list, setList] = useState([]);

  const handleEnrollment = async (e) => {
    e.preventDefault();
    try {
      console.log(data);
      Notiflix.Loading.standard();
      if (isnew === false) {
        data["id"] = recordid;
      }
      await axios.post(
        getUrl(isnew === true ? "addUsers" : "updateUsers"),
        data
      );
      setData(initialData);
      setIsnew(true);
      setError({
        message: "User Processed Successfully",
        color: "success",
      });
      Notiflix.Loading.remove();
      getList();
    } catch (error) {
      Notiflix.Loading.remove();
      console.log(error);
      if (
        error.response &&
        (error.response.status === 400 || error.response.status === 401)
      ) {
        setError({
          message: error.response.data.message,
          color: "danger",
        });
      }
    }
  };

  const getList = async () => {
    Notiflix.Loading.standard("Loading Users");
    let resp = await axios.post(getUrl("listUsers"));
    setList(resp.data);
    Notiflix.Loading.remove();
  };

  useEffect(() => {
    getList();
  }, []);

  const initialData = {
    name: "",
    email: "",
    nic: "",
    password: "",
    usertype: 1,
  };

  const [data, setData] = useState(initialData);

  const [isnew, setIsnew] = useState(true);
  const [recordid, setRecordid] = useState(0);

  const [error, setError] = useState({
    message: "",
    color: "success",
  });

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };

  const handleDelete = async (record) => {
    Swal.fire({
      title: "Are you sure to delete this record",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
    }).then(async (result) => {
      Notiflix.Loading.standard();
      await axios.post(getUrl("deleteUsers"), { id: record });
      Notiflix.Loading.remove();
      getList();
    });
  };

  const handleGet = async (record) => {
    Swal.fire({
      title: "Are you sure to edit this record",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
    }).then(async (result) => {
      Notiflix.Loading.standard();
      let response = await axios.post(getUrl("getUsers"), { id: record });
      if (response.status === 200) {
        setIsnew(false);
        setRecordid(response.data._id);
        setData({
          email: response.data.email,
          name: response.data.name,
          nic: response.data.nic,
          usertype: response.data.usertype,
        });
      }
      Notiflix.Loading.remove();
    });
  };

  return (
    <>
      <Header />
      <Container fluid>
        <Row className="justify-content-center mt-5">
          <Col
            md={9}
            sm={12}
            className="shadow-sm text-primary mt-5 p-4 rounded"
          >
            <h6 className=" text-primary pb-4">User Account List</h6>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>No</TableCell>
                    <TableCell align="right">Name</TableCell>
                    <TableCell align="right">NIC</TableCell>
                    <TableCell align="right">User Type</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {list.length === 0 && (
                    <TableRow className="text-center">
                      <TableCell className="text-danger" colSpan={5}>
                        No Data Found
                      </TableCell>
                    </TableRow>
                  )}
                  {list.map((item, index) => (
                    <TableRow
                      key={item._id}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {index + 1}
                      </TableCell>
                      <TableCell align="right">{item.name}</TableCell>
                      <TableCell align="right">{item.nic}</TableCell>
                      <TableCell align="right">
                        {" "}
                        <Badge bg="primary">
                          {
                            {
                              1: "Administrator",
                              2: "Vendor User",
                              3: "Customer / Standard User",
                            }[item.usertype]
                          }
                        </Badge>
                      </TableCell>
                      <TableCell align="right">
                        <Button
                          className="mx-1"
                          variant="primary"
                          size="sm"
                          onClick={() => handleGet(item._id)}
                        >
                          Edit
                        </Button>
                        <Button
                          className="mx-1"
                          variant="danger"
                          size="sm"
                          onClick={() => handleDelete(item._id)}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Col>
          <Col
            md={3}
            sm={12}
            className="shadow-sm text-primary mt-5 p-4 rounded"
          >
            <h6 className=" text-primary pb-4">Add / Update User Accounts</h6>

            <Form className="text-start" onSubmit={handleEnrollment}>
              <Form.Group className="mb-3" controlId="nameGroup">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  onChange={handleChange}
                  required
                  name="name"
                  value={data.name}
                  type="text"
                  placeholder="Enter user name"
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="nicGroup">
                <Form.Label>NIC</Form.Label>
                <Form.Control
                  onChange={handleChange}
                  required
                  name="nic"
                  value={data.nic}
                  type="text"
                  placeholder="Enter user nic"
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="emailGroup">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  onChange={handleChange}
                  required
                  name="email"
                  value={data.email}
                  type="text"
                  placeholder="Enter user Email"
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="passwordGroup">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  onChange={handleChange}
                  name="password"
                  value={data.password}
                  type="password"
                  placeholder="Enter user account password"
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="usertypeGroup">
                <Form.Label>Usertype</Form.Label>
                <Form.Select
                  onChange={handleChange}
                  name="usertype"
                  value={data.usertype}
                >
                  <option value={1}>Administrator</option>
                  <option value={2}>Vendor / Staff</option>
                  <option value={3}>Customer / Standard User</option>
                </Form.Select>
              </Form.Group>
              {error && error.message && (
                <Alert key={error.color} variant={error.color}>
                  {error.message}
                </Alert>
              )}
              <Button
                className="mt-4 w-100"
                variant={isnew ? "primary" : "warning"}
                type="submit"
              >
                {isnew ? "Submit" : "Update"}
              </Button>
              <Button
                className="mt-4 w-100"
                variant="danger"
                type="button"
                onClick={() => {
                  setData(initialData);
                  setIsnew(true);
                }}
              >
                Reset
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Users;
