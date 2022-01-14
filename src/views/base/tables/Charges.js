import React, { useEffect, useState } from "react";
import { freeSet } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import {
  CBadge,
  CButton,
  CCol,
  CDataTable,
  CFormGroup,
  CInput,
  CInputFile,
  CInputGroup,
  CInputGroupPrepend,
  CInputGroupText,
  CLabel,
  CRow,
  CTextarea,
} from "@coreui/react";
import { supabase } from "src/config/configSupabase";
import _ from "lodash";
import {
  createCharge,
  createPay,
  deleteCharge,
  getTypeCharge,
  updateCharge,
} from "src/state/querys/Charges";
import moment from "moment";

import Select from "react-select";
import {
  createTask,
  createTaskforAdmin,
  finishTaskPending,
  getLastTaskByUserID,
} from "src/state/querys/Tasks";
import { useKeySelector } from "src/hook/general";
import { UploadFile } from "src/components/buttons";
import { uploadImage } from "src/state/querys/General";

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
  const { user } = useKeySelector(["user"]);
  const [charges, setCharges] = useState([]);
  const [noteTask, setNoteTask] = useState("");
  const [amount, setAmount] = useState(0);
  const [ispayment, setIspayment] = useState(false);
  const [chargesSelected, setChargesSelected] = useState([]);
  const [chargesTypes, setChargesTypes] = useState([]);
  const [chargesTypeSelected, setChargesTypeSelected] = useState({});
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [edit, setEdit] = useState("");
  const [files, setFiles] = useState([]);
  const componentDidMount = (limit = 1) => {
    setLoading(true);
    Promise.all([
      supabase
        .from("Charge")
        .select("*,ChargeTypeID(*)")
        .eq("ClientID", userID)
        .limit(limit * 5 + 1)
        .order("CreatedAt", { ascending: false })
        .then((snapshot) => snapshot.data),
      getTypeCharge(),
    ]).then((response) => {
      const chargesApi = response[0];
      const chargesTypeApi = response[1];
      setChargesTypes(chargesTypeApi);
      setCharges(
        chargesApi.map((charge) => ({
          ID: charge.ID,
          nombre: charge.ChargeTypeID.Name,
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
      ChargeTypeID: chargesTypeSelected.ID,
      CreatedAt: moment().toDate(),
      Charge: amount,
      ClientID: userID,
      State: false,
      Remaining: 0,
    }).then(() => {
      componentDidMount();
      setChargesTypeSelected({});
      setName(0);
      setAmount(0);
    });
  };

  const handleEditcharge = () =>
    updateCharge(
      {
        ChargeTypeID: chargesTypeSelected.ID,
        Name: name,
        Charge: amount,
        ClientID: userID,
      },
      edit
    ).then(() => {
      componentDidMount();
      setName(0);
      setChargesTypeSelected({});
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
          <>
            <CCol col="2">
              <Select
                isMulti
                name="colors"
                options={charges
                  .filter(({ State }) => !State)
                  .map((charge) => ({
                    value: parseInt(charge.Charge),
                    label: charge.nombre,
                    ID: charge.ID,
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
          </>
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
              <CLabel htmlFor="amount">Tipo</CLabel>
              <Select
                name="colors"
                options={chargesTypes.map((charge) => ({
                  value: charge.ID,
                  label: charge.Name,
                  ID: charge.ID,
                }))}
                className="basic-multi-select"
                classNamePrefix="select"
                value={chargesTypeSelected}
                onChange={(selected) => {
                  setChargesTypeSelected(selected);
                }}
              />
            </CCol>
          </>
        )}
        {user?.RolID?.ID === 7 && (
          <>
            <CCol xs="2">
              <CFormGroup>
                <CLabel htmlFor="priceBase">Nota para el administrador</CLabel>
                <CTextarea
                  id="name"
                  value={noteTask}
                  onChange={({ target: { value } }) => setNoteTask(value)}
                />
              </CFormGroup>
            </CCol>
            {ispayment && (
              <CCol xs="2">
                <CButton color="info">
                  <UploadFile
                    onChange={({ target: { files } }) => setFiles(files)}
                  >
                    Subir Archivo
                  </UploadFile>
                </CButton>
              </CCol>
            )}
          </>
        )}
        <CCol col="2" style={{ paddingTop: 30 }}>
          <CButton
            color={"success"}
            onClick={() => {
              if (user?.RolID?.ID === 7) {
                const nameFile = `${moment().unix()}.jpg`;

                uploadImage(nameFile, files[0]);

                return createTaskforAdmin(
                  user.ZoneID[0].AddressID.AddressZoneID,
                  {
                    TypeID: ispayment ? 12 : edit === "" ? 10 : 11,
                    ClientID: user.ID,
                    Note: noteTask,
                    Files: files[0].name ? nameFile : null,
                    Data: ispayment
                      ? chargesSelected
                      : edit === ""
                      ? {
                          ChargeTypeID: chargesTypeSelected.ID,
                          CreatedAt: moment().toDate(),
                          Charge: amount,
                          ClientID: userID,
                          State: false,
                          Remaining: 0,
                        }
                      : {
                          ChargeTypeID: chargesTypeSelected.ID,
                          Name: name,
                          Charge: amount,
                          ClientID: userID,
                          ID: edit,
                        },
                  }
                ).then(() => {
                  componentDidMount();
                  setChargesTypeSelected({});
                  setName(0);
                  setAmount(0);
                  setNoteTask("");
                });
              }

              if (ispayment) {
                return Promise.all([
                  chargesSelected.map(({ ID }) => createPay(ID)),
                ]).then(() => {
                  setAmount(0);
                  setChargesSelected([]);
                  componentDidMount();

                  if (charges.filter(({ State }) => !State).length === 1) {
                    getLastTaskByUserID(userID).then((taskPending) => {
                      if (taskPending.length > 0) {
                        finishTaskPending(taskPending[0].ID);
                      } else {
                        createTask({
                          TypeID: 5,
                          AssignedID: 12,
                          ClientID: userID,
                          StateID: 1,
                          Note: "Conectar a este usuario ",
                        });
                      }
                    });
                  }
                });
              }

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
                        if (item.ChargeTypeID?.ID)
                          setChargesTypeSelected({
                            ...item.ChargeTypeID,
                            label: item.ChargeTypeID.Name,
                          });

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
