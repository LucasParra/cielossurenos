import React, { useEffect, useState } from "react";
import { freeSet } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import {
  CBadge,
  CButton,
  CCol,
  CDataTable,
  CInput,
  CInputGroup,
  CInputGroupPrepend,
  CInputGroupText,
  CLabel,
  CRow,
} from "@coreui/react";
import { supabase } from "src/config/configSupabase";
import _ from "lodash";
import {
  chargeMount,
  createCharge,
  deleteCharge,
  updateCharge,
} from "src/state/querys/Charges";
import moment from "moment";

import Select from "react-select";
import { createTask } from "src/state/querys/Tasks";

const fields = [
  "ID",
  "fecha",
  "nombre",
  "cargo",
  "restante",
  "estado",
  "editar",
  "eliminar",
];

const Charges = ({ userID }) => {
  const [charges, setCharges] = useState([]);
  const [amount, setAmount] = useState(0);
  const [ispayment, setIspayment] = useState(false);
  const [chargesSelected, setChargesSelected] = useState([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [edit, setEdit] = useState("");
  const componentDidMount = (limit = 1) => {
    setLoading(true);
    Promise.all([
      supabase
        .from("Charge")
        .select("*")
        .eq("ClientID", userID)
        .limit(limit * 5 + 1)
        .order("CreatedAt", { ascending: true })
        .then((snapshot) => snapshot.data),
    ]).then((response) => {
      const chargesApi = response[0];
      setCharges(
        chargesApi.map((charge) => ({
          ID: charge.ID,
          nombre: _.split(charge.Name, "|", 1),
          cargo: new Intl.NumberFormat("es-CL", {
            currency: "CLP",
            style: "currency",
          }).format(charge.Charge),
          fecha: moment(charge.CreatedAt).format("DD-MM-YYYY"),
          ...charge,
        }))
      );
      setLoading(false);
    });
  };
  const handleAddCharge = () => {
    if (charges.filter(({ State }) => !State).length === 1) {
      createTask({
        TypeID: 4,
        AssignedID: 12,
        ClientID: userID,
        StateID: 1,
        Note: "desconectar a este usuario ya que paso a estado moroso",
      });
    }

    createCharge({
      Name: name,
      CreatedAt: moment().toDate(),
      Charge: amount,
      ClientID: userID,
      State: false,
      Remaining: 0,
    }).then(() => {
      componentDidMount();
      setName(0);
      setAmount(0);
    });
  };

  const handleEditcharge = () =>
    updateCharge(
      {
        Name: name,
        Charge: amount,
        ClientID: userID,
      },
      edit
    ).then(() => {
      componentDidMount();
      setName(0);
      setAmount(0);
      setEdit("");
    });

  useEffect(componentDidMount, []);
  return (
    <>
      <CRow>
        <CCol md="2" col="2">
          <CButton
            color="danger"
            onClick={() => {
              setEdit(false);
              setAmount(0);
              setName("");
              setIspayment(false);
            }}
          >
            Crear Cargo
          </CButton>
        </CCol>
        <CCol md="2" col="2">
          <CButton
            color="success"
            onClick={() => {
              setIspayment(true);
              setAmount(0);
            }}
          >
            Crear Pago
          </CButton>
        </CCol>
      </CRow>
      <CRow
        style={{ margin: 10, marginBottom: 20 }}
        className="align-items-center"
      >
        {ispayment ? (
          <CCol col="2">
            <Select
              isMulti
              name="colors"
              options={charges
                .filter(({ State }) => !State)
                .map((charge) => ({
                  value: parseInt(charge.Charge),
                  label: charge.nombre[0],
                }))}
              className="basic-multi-select"
              classNamePrefix="select"
              value={chargesSelected}
              onChange={(selected) => {
                setChargesSelected(selected);
                selected.map(({ value }) =>
                  setAmount(amount + parseInt(value))
                );
              }}
            />
          </CCol>
        ) : (
          <>
            <CCol col="2">
              <CLabel htmlFor="amount">Monto</CLabel>
              <div className="controls">
                <CInputGroup className="input-prepend">
                  <CInputGroupPrepend>
                    <CInputGroupText>$</CInputGroupText>
                  </CInputGroupPrepend>
                  <CInput
                    id="amount"
                    size="16"
                    type="number"
                    onChange={({ target: { value } }) =>
                      setAmount(parseInt(value))
                    }
                    value={amount}
                  />
                </CInputGroup>
              </div>
            </CCol>
            <CCol col="2">
              <CLabel htmlFor="name">Nombre</CLabel>
              <CInput
                id="name"
                name="name"
                value={name}
                onChange={({ target: { value } }) => setName(value)}
              />
            </CCol>
          </>
        )}
        <CCol col="2" style={{ paddingTop: 30 }}>
          <CButton
            color={"success"}
            onClick={() => {
              if (ispayment)
                return chargeMount(userID, amount, componentDidMount).then(
                  () => {
                    setAmount(0);
                    setChargesSelected([]);
                    componentDidMount();
                    if (charges.filter(({ State }) => !State).length === 1) {
                      createTask({
                        TypeID: 5,
                        AssignedID: 12,
                        ClientID: userID,
                        StateID: 1,
                        Note: "Conectar a este usuario ",
                      });
                    }
                  }
                );

              if (edit === "") {
                handleAddCharge();
              } else {
                handleEditcharge();
              }
            }}
          >
            {!ispayment
              ? edit !== ""
                ? "Editar Cargo"
                : "Añadir Cargo"
              : "Crear Pago"}
          </CButton>
        </CCol>

        {!ispayment && edit !== "" && (
          <CCol col="2" style={{ paddingTop: 30 }}>
            <CButton
              color={"danger"}
              onClick={() => {
                componentDidMount();
                setName(0);
                setAmount(0);
                setEdit("");
              }}
            >
              Cancelar Edicion
            </CButton>
          </CCol>
        )}
      </CRow>
      <CRow>
        <CDataTable
          items={charges}
          fields={fields}
          itemsPerPage={5}
          onPageChange={componentDidMount}
          pagination
          loading={loading}
          scopedSlots={{
            eliminar: (item) => (
              <td className="py-2">
                <CRow className="align-items-center">
                  <CCol col="2" xs="2" sm="2" md="2" className="mb-2 mb-xl-0">
                    <CButton
                      color="danger"
                      onClick={() =>
                        deleteCharge(item.ID).then(() => {
                          setLoading(false);
                          componentDidMount();
                        })
                      }
                    >
                      <CIcon content={freeSet.cilTrash} size="xl" />
                    </CButton>
                  </CCol>
                </CRow>
              </td>
            ),

            estado: (item) => (
              <td>
                <CBadge color={item.State ? "success" : "danger"}>
                  {item.State ? "Pagado" : "Deuda"}
                </CBadge>
              </td>
            ),
            restante: (item) => (
              <td>
                {new Intl.NumberFormat("es-CL", {
                  currency: "CLP",
                  style: "currency",
                }).format(item.Remaining)}
              </td>
            ),
            editar: (item) => (
              <td className="py-2">
                <CRow className="align-items-center">
                  <CCol col="2" xs="2" sm="2" md="2" className="mb-2 mb-xl-0">
                    <CButton
                      color="info"
                      onClick={() => {
                        setIspayment(false);
                        setName(item.nombre);
                        setAmount(parseInt(item.Charge));
                        setEdit(item.ID);
                      }}
                    >
                      <CIcon content={freeSet.cilPencil} size="xl" />
                    </CButton>
                  </CCol>
                </CRow>
              </td>
            ),
          }}
        />
      </CRow>
    </>
  );
};

export default Charges;
