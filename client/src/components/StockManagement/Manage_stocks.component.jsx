import React from "react";
import LoadingComponent from "../Loading/Loading.component";
import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import IndiPizzaBaseComp from "./IndiPizzaBaseComp.component";
import IndiPizzaSauceComp from "./IndiPizzaSauce.component";
import IndiPzzaVeggiesComp from "./IndiPizzaVeggies.component";
import IndiPizzaMeatComp from "./IndiPizzaMeat.component";
import IndiPizzaCheeseComp from "./IndiPizzaCheese.component";
import {
  MDBTabs,
  MDBTabsItem,
  MDBTabsLink,
  MDBTabsContent,
  MDBTabsPane,
} from "mdb-react-ui-kit";
const ManageStocks = () => {
  const [basicActive, setBasicActive] = useState("tab1");

  const handleBasicClick = (value) => {
    if (value === basicActive) {
      return;
    }

    setBasicActive(value);
  };
  const [pizzaBaseArr, setPizzaBaseArr] = useState([]);
  const [pizzaSauceArr, setPizzaSauceArr] = useState([]);
  const [pizzaVeggiesArr, setPizzaVeggiesArr] = useState([]);
  const [pizzaMeatArr, setPizzaMeatArr] = useState([]);
  const [pizzaCheeseArr, setPizzaCheeseArr] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pizzaBaseformData, setPizzaBaseFormData] = useState({
    baseName: "",
    smallQuantity: "",
    mediumQuantity: "",
    largeQuantity: "",
  });
  const [pizzaSauceformData, setPizzaSauceFormData] = useState({
    sauceName: "",
    sauceQuantity: "",
  });
  const [pizzaVeggiesformData, setPizzaVeggiesFormData] = useState({
    veggiesName: "",
    veggiesQuantity: "",
  });
  const [pizzaMeatformData, setPizzaMeatFormData] = useState({
    meatName: "",
    meatQuantity: "",
  });
  const [pizzaCheeseformData, setPizzaCheeseFormData] = useState({
    cheeseName: "",
    cheeseQuantity: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("pizzza")) {
      navigate("/users/login");
    }
    // eslint-disable-next-line
  }, []);

  const getPizzaBase = async () => {
    let url = "http://localhost:5000/api/admin/manage-stocks/getpizzabase";
    const { status, data } = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("pizzza")}`,
      },
    });
    if (status === 200) {
      return data.PizzaBases;
    } else {
      console.log(data.error);
      return;
    }
  };
  const getPizzaSauce = async () => {
    let url = "http://localhost:5000/api/admin/manage-stocks/getpizzasauce";
    const { status, data } = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("pizzza")}`,
      },
    });
    if (status === 200) {
      return data.PizzaSauce;
    } else {
      console.log(data.error);
      return;
    }
  };
  const getPizzaVeggies = async () => {
    let url = "http://localhost:5000/api/admin/manage-stocks/getpizzaveggies";
    const { status, data } = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("pizzza")}`,
      },
    });
    if (status === 200) {
      return data.PizzaVeggies;
    } else {
      console.log(data.error);
      return;
    }
  };
  const getPizzaMeat = async () => {
    let url = "http://localhost:5000/api/admin/manage-stocks/getpizzameat";
    const { status, data } = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("pizzza")}`,
      },
    });
    if (status === 200) {
      return data.PizzaMeat;
    } else {
      console.log(data.error);
      return;
    }
  };
  const getPizzaCheese = async () => {
    let url = "http://localhost:5000/api/admin/manage-stocks/getpizzacheese";
    const { status, data } = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("pizzza")}`,
      },
    });
    if (status === 200) {
      return data.pizzaCheese;
    } else {
      console.log(data.error);
      return;
    }
  };
  const handleChangePizzaBase = (e) => {
    setPizzaBaseFormData({
      ...pizzaBaseformData,
      [e.target.name]: e.target.value,
    });
  };
  const handleChangePizzaSauce = (e) => {
    setPizzaSauceFormData({
      ...pizzaSauceformData,
      [e.target.name]: e.target.value,
    });
  };
  const handleChangePizzaVeggies = (e) => {
    setPizzaVeggiesFormData({
      ...pizzaVeggiesformData,
      [e.target.name]: e.target.value,
    });
  };
  const handleChangePizzaMeat = (e) => {
    setPizzaMeatFormData({
      ...pizzaMeatformData,
      [e.target.name]: e.target.value,
    });
  };
  const handleChangePizzaCheese = (e) => {
    setPizzaCheeseFormData({
      ...pizzaCheeseformData,
      [e.target.name]: e.target.value,
    });
  };
  useEffect(() => {
    getPizzaBase().then((res) => {
      setPizzaBaseArr(res);
    });
    getPizzaVeggies().then((res) => {
      setPizzaVeggiesArr(res);
    });
    getPizzaMeat().then((res) => {
      setPizzaMeatArr(res);
    });
    getPizzaSauce().then((res) => {
      setPizzaSauceArr(res);
    });
    getPizzaCheese().then((res) => {
      setPizzaCheeseArr(res);
      console.log(res);
    });
    setLoading(false);
  }, []);
  const addNewPizzaBase = async () => {
    let url = "http://localhost:5000/api/admin/manage-stocks/add/pizzabase";
    const { status } = await axios.post(url, pizzaBaseformData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("pizzza")}`,
      },
    });
    if (status === 200) {
      let res = await getPizzaBase();
      setPizzaBaseArr(res);
      return;
    } else {
      Swal.fire("Oh no something went wrong", "", "error");
      return;
    }
  };
  const addNewPizzaSauce = async () => {
    let url = "http://localhost:5000/api/admin/manage-stocks/add/pizzasauce";
    const { status } = await axios.post(url, pizzaSauceformData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("pizzza")}`,
      },
    });
    if (status === 200) {
      let res = await getPizzaSauce();
      setPizzaSauceArr(res);
      return;
    } else {
      Swal.fire("Oh no something went wrong", "", "error");
      return;
    }
  };
  const addNewPizzaVeggies = async () => {
    let url = "http://localhost:5000/api/admin/manage-stocks/add/pizzaveggies";
    const { status } = await axios.post(url, pizzaVeggiesformData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("pizzza")}`,
      },
    });
    if (status === 200) {
      let res = await getPizzaVeggies();
      setPizzaVeggiesArr(res);
      return;
    } else {
      Swal.fire("Oh no something went wrong", "", "error");
      return;
    }
  };
  const addNewPizzaMeat = async () => {
    console.log(pizzaMeatformData);
    let url = "http://localhost:5000/api/admin/manage-stocks/add/pizzameat";
    const { status } = await axios.post(url, pizzaMeatformData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("pizzza")}`,
      },
    });
    if (status === 200) {
      let res = await getPizzaMeat();
      setPizzaMeatArr(res);
      return;
    } else {
      Swal.fire("Oh no something went wrong", "", "error");
      return;
    }
  };
  const addNewPizzaCheese = async () => {
    console.log(pizzaMeatformData);
    let url = "http://localhost:5000/api/admin/manage-stocks/add/pizzacheese";
    const { status } = await axios.post(url, pizzaCheeseformData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("pizzza")}`,
      },
    });
    if (status === 200) {
      let res = await getPizzaCheese();
      setPizzaCheeseArr(res);
      return;
    } else {
      Swal.fire("Oh no something went wrong", "", "error");
      return;
    }
  };
  return (
    <>
      {!loading ? (
        <div className="container-fluid text-center">
          <h1 style={{ color: "white" }}>Manage Your Pizza Stock</h1>
          <MDBTabs pills className="mb-3 justify-content-center">
            <MDBTabsItem>
              <MDBTabsLink
                onClick={() => handleBasicClick("tab1")}
                active={basicActive === "tab1"}
              >
                Pizza Base
              </MDBTabsLink>
            </MDBTabsItem>
            <MDBTabsItem>
              <MDBTabsLink
                onClick={() => handleBasicClick("tab2")}
                active={basicActive === "tab2"}
              >
                Pizza Sauce
              </MDBTabsLink>
            </MDBTabsItem>
            <MDBTabsItem>
              <MDBTabsLink
                onClick={() => handleBasicClick("tab3")}
                active={basicActive === "tab3"}
              >
                Pizza Veggies
              </MDBTabsLink>
            </MDBTabsItem>
            <MDBTabsItem>
              <MDBTabsLink
                onClick={() => handleBasicClick("tab4")}
                active={basicActive === "tab4"}
              >
                Pizza Meat
              </MDBTabsLink>
            </MDBTabsItem>
            <MDBTabsItem>
              <MDBTabsLink
                onClick={() => handleBasicClick("tab5")}
                active={basicActive === "tab5"}
              >
                Pizza Cheese
              </MDBTabsLink>
            </MDBTabsItem>
          </MDBTabs>

          <MDBTabsContent>
            <MDBTabsPane show={basicActive === "tab1"}>
              <button
                className="btn btn-primary"
                data-bs-toggle="modal"
                data-bs-target="#exampleModal1"
              >
                Add New Pizza Base
              </button>
              <div
                className="modal fade"
                id="exampleModal1"
                tabIndex="-1"
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
              >
                <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h1 className="modal-title fs-5" id="exampleModalLabel">
                        Add New Pizza Base
                      </h1>
                      <button
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                      ></button>
                    </div>

                    <div className="modal-body">
                      <div className="mb-3 input-group">
                        <span className="input-group-text" id="basic-addon1">
                          Pizza Base Name
                        </span>
                        <input
                          type="text"
                          className="form-control"
                          id="baseName"
                          name="baseName"
                          value={pizzaBaseformData.baseName}
                          onChange={handleChangePizzaBase}
                          required
                        />
                      </div>
                      <div className="mb-3 input-group">
                        <span className="input-group-text" id="basic-addon1">
                          Small Base Quantity
                        </span>
                        <input
                          type="text"
                          className="form-control"
                          id="smallQuantity"
                          name="smallQuantity"
                          value={pizzaBaseformData.smallQuantity}
                          onChange={handleChangePizzaBase}
                          required
                        />
                      </div>
                      <div className="mb-3 input-group">
                        <span className="input-group-text" id="basic-addon2">
                          Medium Base Quantity
                        </span>
                        <input
                          type="text"
                          className="form-control"
                          id="mediumQuantity"
                          name="mediumQuantity"
                          value={pizzaBaseformData.mediumQuantity}
                          onChange={handleChangePizzaBase}
                          required
                        />
                      </div>
                      <div className="mb-3 input-group">
                        <span className="input-group-text" id="basic-addon3">
                          Large Base Quantity
                        </span>
                        <input
                          type="text"
                          className="form-control"
                          id="largeQuantity"
                          name="largeQuantity"
                          value={pizzaBaseformData.largeQuantity}
                          onChange={handleChangePizzaBase}
                          required
                        />
                      </div>
                    </div>
                    <div className="modal-footer">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        data-bs-dismiss="modal"
                      >
                        Close
                      </button>
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={addNewPizzaBase}
                        data-bs-dismiss="modal"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="container text-center">
                <div className="row">
                  {pizzaBaseArr.map((base, idx) => (
                    <div className="col-sm mb-3" key={idx}>
                      <IndiPizzaBaseComp
                        pizzaBaseItem={base}
                        setPizzaBaseArr={setPizzaBaseArr}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </MDBTabsPane>
            <MDBTabsPane show={basicActive === "tab2"}>
              <button
                className="btn btn-primary"
                data-bs-toggle="modal"
                data-bs-target="#exampleModal2"
              >
                Add Pizza Sauce
              </button>
              <div
                className="modal fade"
                id="exampleModal2"
                tabIndex="-1"
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
              >
                <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h1 className="modal-title fs-5" id="exampleModalLabel">
                        Add New Pizza Sauce
                      </h1>
                      <button
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                      ></button>
                    </div>

                    <div className="modal-body">
                      <div className="mb-3 input-group">
                        <span className="input-group-text" id="basic-addon1">
                          Pizza Sauce Name
                        </span>
                        <input
                          type="text"
                          className="form-control"
                          id="sauceName"
                          name="sauceName"
                          value={pizzaSauceformData.sauceName}
                          onChange={handleChangePizzaSauce}
                          required
                        />
                      </div>
                      <div className="mb-3 input-group">
                        <span className="input-group-text" id="basic-addon1">
                          Sauce Quantity(ml)
                        </span>
                        <input
                          type="text"
                          className="form-control"
                          id="sauceQuantity"
                          name="sauceQuantity"
                          value={pizzaSauceformData.sauceQuantity}
                          onChange={handleChangePizzaSauce}
                          required
                        />
                      </div>
                    </div>
                    <div className="modal-footer">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        data-bs-dismiss="modal"
                      >
                        Close
                      </button>
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={addNewPizzaSauce}
                        data-bs-dismiss="modal"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="container text-center">
                <div className="row">
                  {pizzaSauceArr.map((sauce, idx) => (
                    <div className="col-sm mb-3" key={idx}>
                      <IndiPizzaSauceComp
                        pizzaSauceItem={sauce}
                        setPizzaSauceArr={setPizzaSauceArr}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </MDBTabsPane>
            <MDBTabsPane show={basicActive === "tab3"}>
              <button
                className="btn btn-primary"
                data-bs-toggle="modal"
                data-bs-target="#exampleModal3"
              >
                Add Pizza Veggies
              </button>
              <div
                className="modal fade"
                id="exampleModal3"
                tabIndex="-1"
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
              >
                <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h1 className="modal-title fs-5" id="exampleModalLabel">
                        Add New Pizza Veggie
                      </h1>
                      <button
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                      ></button>
                    </div>

                    <div className="modal-body">
                      <div className="mb-3 input-group">
                        <span className="input-group-text" id="basic-addon1">
                          Pizza veggie Name
                        </span>
                        <input
                          type="text"
                          className="form-control"
                          id="veggiesName"
                          name="veggiesName"
                          value={pizzaSauceformData.veggiesNameName}
                          onChange={handleChangePizzaVeggies}
                          required
                        />
                      </div>
                      <div className="mb-3 input-group">
                        <span className="input-group-text" id="basic-addon1">
                          Veggies Quantity(gm)
                        </span>
                        <input
                          type="text"
                          className="form-control"
                          id="veggiesQuantity"
                          name="veggiesQuantity"
                          value={pizzaVeggiesformData.veggiesQuantity}
                          onChange={handleChangePizzaVeggies}
                          required
                        />
                      </div>
                    </div>
                    <div className="modal-footer">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        data-bs-dismiss="modal"
                      >
                        Close
                      </button>
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={addNewPizzaVeggies}
                        data-bs-dismiss="modal"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="container text-center">
                <div className="row">
                  {pizzaVeggiesArr.map((veggies, idx) => (
                    <div className="col-sm mb-3" key={idx}>
                      <IndiPzzaVeggiesComp
                        pizzaVeggiesItem={veggies}
                        setPizzaVeggiesArr={setPizzaVeggiesArr}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </MDBTabsPane>
            <MDBTabsPane show={basicActive === "tab4"}>
              <button
                className="btn btn-primary"
                data-bs-toggle="modal"
                data-bs-target="#exampleModal4"
              >
                Add Pizza Meat
              </button>
              <div
                className="modal fade"
                id="exampleModal4"
                tabIndex="-1"
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
              >
                <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h1 className="modal-title fs-5" id="exampleModalLabel">
                        Add New Pizza Meat
                      </h1>
                      <button
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                      ></button>
                    </div>

                    <div className="modal-body">
                      <div className="mb-3 input-group">
                        <span className="input-group-text" id="basic-addon1">
                          Pizza Meat Name
                        </span>
                        <input
                          type="text"
                          className="form-control"
                          id="meatName"
                          name="meatName"
                          value={pizzaMeatformData.meatName}
                          onChange={handleChangePizzaMeat}
                          required
                        />
                      </div>
                      <div className="mb-3 input-group">
                        <span className="input-group-text" id="basic-addon1">
                          Meat Quantity(gm)
                        </span>
                        <input
                          type="text"
                          className="form-control"
                          id="meatQuantity"
                          name="meatQuantity"
                          value={pizzaMeatformData.meatQuantity}
                          onChange={handleChangePizzaMeat}
                          required
                        />
                      </div>
                    </div>
                    <div className="modal-footer">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        data-bs-dismiss="modal"
                      >
                        Close
                      </button>
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={addNewPizzaMeat}
                        data-bs-dismiss="modal"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="container text-center">
                <div className="row">
                  {pizzaMeatArr.map((pizzaMeat, idx) => (
                    <div className="col-sm mb-3" key={idx}>
                      <IndiPizzaMeatComp
                        pizzaMeatItem={pizzaMeat}
                        setPizzaMeatArr={setPizzaMeatArr}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </MDBTabsPane>
            <MDBTabsPane show={basicActive === "tab5"}>
              <button
                className="btn btn-primary"
                data-bs-toggle="modal"
                data-bs-target="#exampleModal5"
              >
                Add Pizza Cheese
              </button>
              <div
                className="modal fade"
                id="exampleModal5"
                tabIndex="-1"
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
              >
                <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h1 className="modal-title fs-5" id="exampleModalLabel">
                        Add New Pizza Cheese
                      </h1>
                      <button
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                      ></button>
                    </div>

                    <div className="modal-body">
                      <div className="mb-3 input-group">
                        <span className="input-group-text" id="basic-addon1">
                          Pizza Cheese Name
                        </span>
                        <input
                          type="text"
                          className="form-control"
                          id="cheeseName"
                          name="cheeseName"
                          value={pizzaCheeseformData.cheeseName}
                          onChange={handleChangePizzaCheese}
                          required
                        />
                      </div>
                      <div className="mb-3 input-group">
                        <span className="input-group-text" id="basic-addon1">
                          Meat Quantity(gm)
                        </span>
                        <input
                          type="text"
                          className="form-control"
                          id="cheeseQuantity"
                          name="cheeseQuantity"
                          value={pizzaCheeseformData.cheeseQuantity}
                          onChange={handleChangePizzaCheese}
                          required
                        />
                      </div>
                    </div>
                    <div className="modal-footer">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        data-bs-dismiss="modal"
                      >
                        Close
                      </button>
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={addNewPizzaCheese}
                        data-bs-dismiss="modal"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="container text-center">
                <div className="row">
                  {pizzaCheeseArr.map((pizzaCheese, idx) => (
                    <div className="col-sm mb-3" key={idx}>
                      <IndiPizzaCheeseComp
                        pizzaCheeseItem={pizzaCheese}
                        setPizzaCheeseArr={setPizzaCheeseArr}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </MDBTabsPane>
          </MDBTabsContent>
          {/* <h2 className="btn btn-danger ft-10">Pizza Base</h2> */}
        </div>
      ) : (
        <LoadingComponent />
      )}
    </>
  );
};

export default ManageStocks;
