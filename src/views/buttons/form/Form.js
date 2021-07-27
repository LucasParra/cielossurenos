import React from 'react';
import { useState } from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormGroup,
  CInput,
  CLabel,
  CSelect,
  CRow,
  CButton,
  CForm
} from '@coreui/react'
import { DocsLink } from 'src/reusable'

const Forms = () => {
  const [validated, setValidated] = useState(false)
  const [addressList, setInputList] = useState([{ address: ""}]);

  const handleInputChange = (e, index) => {
    const {  value } = e.target;
    const list = [...addressList];
    list[index].address = value;
    setInputList(list);
  };

  const handleRemoveClick = index => {
    const list = [...addressList];
    list.splice(index, 1);
    setInputList(list);
  };

  const handleAddClick = () => {
    setInputList([...addressList, { address: ""}]);
  };

  const handleSubmit = event => {
    const form = event.currentTarget
    if (form.checkValidity() === false) {
      event.preventDefault()
      event.stopPropagation()
    }
    setValidated(true)
  }
  return (
    <CForm
      className="was-validated"
      noValidate
      validated={validated}
      onSubmit={handleSubmit}
    >
      <CRow>
        <CCol xs="12" sm="9">
          <CCard>
            <CCardHeader>
              Formulario de Usuario
              <DocsLink name="-Input"/>
            </CCardHeader>            
            <CCardBody>
              <CFormGroup>
                <CLabel htmlFor="full name">Nombre Completo</CLabel>
                <CInput id="fullname" placeholder="Ingresa tu Nombre Completo" required />
              </CFormGroup>
              <CFormGroup>
                <CLabel htmlFor="dni">Rut</CLabel>
                <CInput id="dni" placeholder=" Ejemplo:18.123.678-3" required />
              </CFormGroup>
              {addressList.map((currentAddress, i) => (
              <CFormGroup>
                <CCol xs="14" md="14">
                  <CLabel htmlFor="address">Dirección</CLabel>
                  <CInput 
                    id="address" 
                    placeholder="Ingresa tu dirección"
                    value={currentAddress.address}
                    onChange={e => handleInputChange(e, i)}
                    required 
                  />
                  {addressList.length !== 1 && 
                  <CButton
                    className="mr10"
                    onClick={() => handleRemoveClick(i)}
                    type="button" 
                    color="secondary" 
                    variant="ghost"
                  >
                  Eliminar
                  </CButton>
                  }
                  {addressList.length - 1 === i && currentAddress.address.length > 0 &&
                  <CButton 
                    onClick={handleAddClick} 
                    type="button" 
                    color="secondary" 
                    variant="ghost"
                    value="Input"
                  >
                  Añadir
                  </CButton>
                  }
                </CCol>
              </CFormGroup>
              ))}
              <CFormGroup row className="my-0">
                <CCol xs="9">
                  <CFormGroup>
                    <CLabel htmlFor="phone-number">Número de Teléfono 1</CLabel>
                    <CInput id="phone1" placeholder="Ejemplo: 934532244" required />
                  </CFormGroup>
                </CCol>
                <CCol xs="9">
                  <CFormGroup>
                    <CLabel htmlFor="phone-number">Número de Teléfono 2</CLabel>
                    <CInput id="phone2" placeholder="Ejemplo: 934532244" required />
                  </CFormGroup>
                </CCol>
              </CFormGroup>
              <CFormGroup>
                <CLabel htmlFor="email">Correo</CLabel>
                <CInput id="correo" placeholder="Ingresa tu email" required />
              </CFormGroup> 
                <CFormGroup row>
                <CLabel htmlFor="zone">Zona Horaria</CLabel>
                  <CCol xs="8" md="8">
                    <CSelect custom name="zone" id="zone">
                      <option value="0">Selecciona Zona o Localidad</option>
                      <option value="1">Zone 1</option>
                      <option value="2">Zone 2</option>
                      <option value="3">Zone 3</option>
                      <option value="4">Zone 4</option>
                      <option value="5">Zone 5</option>
                      <option value="6">Zone 6</option>
                      <option value="7">Zone 7</option>
                      <option value="8">Zone 8</option>
                      <option value="9">Zone 9</option>
                      <option value="10">Zone 10</option>
                    </CSelect>
                  </CCol>
              </CFormGroup>
              <CFormGroup row>
                <CLabel htmlFor="sucursal">Sucursal</CLabel>
                  <CCol xs="12" md="8">
                    <CSelect custom name="select" id="select">
                      <option disabled>Selecciona Sucursal</option>
                      <option disabled>Viña del Mar</option>
                      <option disabled>Temuco</option>
                    </CSelect>
                  </CCol>
              </CFormGroup>
              <CFormGroup row>
                  <CCol xs="12" md="6">
                    <CLabel htmlFor="ccyear">Fecha de Ingreso o Antiguedad</CLabel>
                    <CInput type="date" id="date-input" name="date-input" placeholder="date" required />
                  </CCol>
                </CFormGroup>
                <CFormGroup row>
                  <CCol xs="12" md="6">
                    <CLabel htmlFor="ccyear">Fecha de nacimiento</CLabel>
                    <CInput type="date" id="date-input" name="date-input" placeholder="date" required />
                  </CCol>
                </CFormGroup>
                <CCol xs="12" md="5">
                  <CButton type="submit" className="btn btn-primary" onClick={(e) => handleSubmit(e)} color="primary">
                    Submit
                  </CButton>
                </CCol>
            </CCardBody> 
          </CCard>
        </CCol>
      </CRow>
    </CForm>
  )
}

export default Forms;
