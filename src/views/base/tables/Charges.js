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
import { saveAs } from "file-saver";

import Select from "react-select";
import {
  createTask,
  finishTaskPending,
  getLastTaskByUserID,
} from "src/state/querys/Tasks";
import { useKeySelector } from "src/hook/general";
import { UploadFile } from "src/components/buttons";
import { getUrlImage, uploadImage } from "src/state/querys/General";
import {
  creditNote,
  generateBill,
  getDetailsDocumentID,
} from "src/state/querys/Bills";
import { getTechnicalZone } from "src/state/querys/Zones";

const fields = ["ID", "fecha", "cargo", "monto", "opciones", "eliminar"];

const Charges = ({
  userID,
  type,
  client,
  setRefreshPayments,
  refreshPayments,
}) => {
  const { user } = useKeySelector(["user"]);
  const [charges, setCharges] = useState([]);
  // const [noteTask, setNoteTask] = useState("");
  const [amount, setAmount] = useState(0);
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
          cargo: charge.ChargeTypeID.Name,
          monto: new Intl.NumberFormat("es-CL", {
            currency: "CLP",
            style: "currency",
          }).format(charge.Charge),
          fecha: moment(charge.CreatedAt).format("DD-MM-YYYY"),
          ...charge,
        }))
      );
      setLoading(false);
      setRefreshPayments(false);
    });
  };
  const handleAddCharge = () => {
    if (charges.filter(({ State }) => !State).length === 1) {
      getTechnicalZone(user?.ZoneID[0].AddressID.AddressZoneID).then(
        (result) => {
          const technical = result[_.random(0, result.length - 1)];
          createTask({
            TypeID: 4,
            AssignedID: technical.User.ID,
            ClientID: userID,
            StateID: 1,
            Note: "desconectar a este usuario ya que paso a estado moroso",
          });
        }
      );
    }

    createCharge({
      ChargeTypeID: chargesTypeSelected.ID,
      CreatedAt: moment().toDate(),
      Charge: amount,
      ClientID: userID,
      State: false,
      Remaining: 0,
    }).then(() => {
      setRefreshPayments(true);
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
  useEffect(componentDidMount, [refreshPayments]);
  return (
    <>
      <CRow
        style={{ margin: 10, marginBottom: 20 }}
        className="align-items-center"
      >
        {type === "pay" ? (
          <>
            <CCol col="2">
              <Select
                isMulti
                name="colors"
                options={charges
                  .filter(({ State }) => !State)
                  .map((charge) => ({
                    value: charge.ID,
                    amount: parseInt(charge.Charge),
                    name: charge.cargo,
                    label: `${charge.cargo} | ${charge.monto} | ${charge.fecha}`,
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
        {type === "pay" && (
          <>
            {/* <CCol xs="2">
              <CFormGroup>
                <CLabel htmlFor="priceBase">Nota para el administrador</CLabel>
                <CTextarea
                  id="name"
                  value={noteTask}
                  onChange={({ target: { value } }) => setNoteTask(value)}
                />
              </CFormGroup>
            </CCol> */}
            <CCol xs="2">
              <CButton color="info">
                <UploadFile
                  onChange={({ target: { files } }) => setFiles(files)}
                >
                  Subir Archivo
                </UploadFile>
              </CButton>
            </CCol>
          </>
        )}
        <CCol col="2" style={{ paddingTop: 30 }}>
          <CButton
            color={"success"}
            onClick={() => {
              // if (user?.RolID?.ID === 7) {
              //   const nameFile = `${moment().unix()}.jpg`;

              //   if (files[0]) uploadImage(nameFile, files[0]);

              //   return createTaskforAdmin(
              //     user.ZoneID[0].AddressID.AddressZoneID,
              //     {
              //       TypeID: ispayment ? 12 : edit === "" ? 10 : 11,
              //       ClientID: user.ID,
              //       Note: noteTask,
              //       Files: files[0].name ? nameFile : null,
              //       Data: ispayment
              //         ? chargesSelected
              //         : edit === ""
              //         ? {
              //             ChargeTypeID: chargesTypeSelected.ID,
              //             CreatedAt: moment().toDate(),
              //             Charge: amount,
              //             ClientID: userID,
              //             State: false,
              //             Remaining: 0,
              //           }
              //         : {
              //             ChargeTypeID: chargesTypeSelected.ID,
              //             Name: name,
              //             Charge: amount,
              //             ClientID: userID,
              //             ID: edit,
              //           },
              //     }
              //   ).then(() => {
              //     componentDidMount();
              //     setChargesTypeSelected({});
              //     setName(0);
              //     setAmount(0);
              //     setNoteTask("");
              //   });
              // }

              if (type === "pay") {
                return generateBill(client, chargesSelected).then(
                  (response) => {
                    window.open(response.urlPublicView, "_blank");

                    const nameFile = `${moment().unix()}.jpg`;

                    if (files[0]) uploadImage(nameFile, files[0]);

                    return Promise.all(
                      chargesSelected.map((charge) =>
                        createPay(
                          charge.ID,
                          files[0] ? nameFile : null,
                          response
                        )
                      )
                    ).then(() => {
                      if (charges.filter(({ State }) => !State).length === 1) {
                        getLastTaskByUserID(userID).then((taskPending) => {
                          if (taskPending.length > 0) {
                            finishTaskPending(taskPending[0].ID);
                          } else {
                            getTechnicalZone(
                              user?.ZoneID[0].AddressID.AddressZoneID
                            ).then((result) => {
                              const technical =
                                result[_.random(0, result.length - 1)];
                              createTask({
                                TypeID: 5,
                                AssignedID: technical.User.ID,
                                ClientID: userID,
                                StateID: 1,
                                Note: "Conectar a este usuario ",
                              });
                            });
                          }
                        });
                      }
                      setAmount(0);
                      setChargesSelected([]);
                      componentDidMount();
                    });
                  }
                );
              }

              if (edit === "") {
                handleAddCharge();
              } else {
                handleEditcharge();
              }
            }}
          >
            {type !== "pay"
              ? edit !== ""
                ? "opciones Cargo"
                : "Añadir Cargo"
              : "Crear Pago"}
          </CButton>
        </CCol>

        {type !== "pay" && edit !== "" && (
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
          items={charges.filter(({ State }) =>
            type === "pay" ? State === true : State === false
          )}
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
                      onClick={() => {
                        getDetailsDocumentID(item.DocumentID).then((detail) => {
                          creditNote(
                            client,
                            item.DocumentID,
                            detail.items[0].id
                          ).then(() =>
                            deleteCharge(item.ID).then(() => {
                              setLoading(false);
                              componentDidMount();
                            })
                          );
                        });
                      }}
                    >
                      <CIcon content={freeSet.cilTrash} size="xl" />
                    </CButton>
                  </CCol>
                </CRow>
              </td>
            ),

            opciones: (item) => (
              <td className="py-2">
                <CRow className="align-items-center">
                  {type !== "pay" ? (
                    <CCol col="2" xs="2" sm="2" md="2" className="mb-2 mb-xl-0">
                      <CButton
                        color="info"
                        onClick={() => {
                          if (item.ChargeTypeID?.ID)
                            setChargesTypeSelected({
                              ...item.ChargeTypeID,
                              label: item.ChargeTypeID.Name,
                            });

                          setName(item.nombre);
                          setAmount(parseInt(item.Charge));
                          setEdit(item.ID);
                        }}
                      >
                        <CIcon content={freeSet.cilPencil} size="xl" />
                      </CButton>
                    </CCol>
                  ) : (
                    <>
                      {item.UrlImage && (
                        <CCol
                          col="2"
                          xs="2"
                          sm="2"
                          md="2"
                          className="mb-2 mb-xl-0"
                        >
                          <CButton
                            color="info"
                            onClick={() => {
                              const { publicURL } = getUrlImage(item.UrlImage);
                              saveAs(publicURL, `${moment().unix()}.jpg`);
                            }}
                          >
                            <CIcon content={freeSet.cilFile} size="xl" />
                          </CButton>
                        </CCol>
                      )}
                      {item.UrlDocument && (
                        <CCol
                          col="2"
                          xs="2"
                          sm="2"
                          md="2"
                          className="mb-2 mb-xl-0"
                        >
                          <CButton
                            color="info"
                            onClick={() =>
                              window.open(item.UrlDocument, "_blank")
                            }
                          >
                            <CIcon
                              content={freeSet.cilCloudDownload}
                              size="xl"
                            />
                          </CButton>
                        </CCol>
                      )}
                    </>
                  )}
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
