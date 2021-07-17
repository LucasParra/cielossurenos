import React from 'react'
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
} from '@coreui/react'
import { DocsLink } from 'src/reusable'

const Forms = () => {
  return (
    <>
    
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
                <CInput id="fullname" placeholder="Ingresa tu Nombre Completo" />
              </CFormGroup>
              <CFormGroup>
                <CLabel htmlFor="dni">Rut</CLabel>
                <CInput id="dni" placeholder=" Ejemplo:18.123.678-3" />
              </CFormGroup>
              <CFormGroup>
                <CLabel htmlFor="address">Dirección</CLabel>
                <CInput id="address" placeholder="Ingresa tu dirección 1" />
              </CFormGroup>
              <CFormGroup>
                <CInput id="address" placeholder="Ingresa tu dirección 2" />
              </CFormGroup>
              <CFormGroup>
                <CInput id="address" placeholder="Ingresa tu dirección 3" />
              </CFormGroup>
              <CFormGroup row className="my-0">
                <CCol xs="9">
                  <CFormGroup>
                    <CLabel htmlFor="phone-number">Número de Teléfono 1</CLabel>
                    <CInput id="phone1" placeholder="Ingresa tu número de teléfono - Ejemplo: 934532244" />
                  </CFormGroup>
                </CCol>
                <CCol xs="9">
                  <CFormGroup>
                    <CLabel htmlFor="phone-number">Número de Teléfono 2</CLabel>
                    <CInput id="phone2" placeholder="Ingresa tu número de teléfono - Ejemplo: 934532244" />
                  </CFormGroup>
                </CCol>
              </CFormGroup>
              <CFormGroup>
                <CLabel htmlFor="email">Correo</CLabel>
                <CInput id="email" placeholder="Ingresa tu email" />
              </CFormGroup> 
                <CFormGroup row>
                <CLabel htmlFor="zone">Zona Horaria</CLabel>
                  <CCol xs="8" md="8">
                    <CSelect custom name="zone" id="zone">
                      <option value="0">Porfavor Selecciona Zona o Localidad</option>
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
                      <option value="0">Porfavor Selecciona Sucursal</option>
                      <option value="1">Viña del Mar</option>
                      <option value="2">Temuco</option>
                    </CSelect>
                  </CCol>
              </CFormGroup>
              <CCard>
                <CCardBody>
                  <CRow>
                  <CLabel htmlFor="">Fecha Ingreso o Antiguedad</CLabel>                
                    <CCol xs="4">
                      <CFormGroup>
                        <CLabel htmlFor="day">Día</CLabel>
                        <CSelect custom name="day" id="day">
                          <option>1</option>
                          <option>2</option>
                          <option>3</option>
                          <option>3</option>
                          <option>4</option>
                          <option>5</option>
                          <option>6</option>
                          <option>7</option>
                          <option>8</option>
                          <option>9</option>
                          <option>10</option>
                          <option>11</option>
                          <option>12</option>
                          <option>13</option>
                          <option>14</option>
                          <option>15</option>
                          <option>16</option>
                          <option>17</option>
                          <option>18</option>
                          <option>19</option>
                          <option>20</option>
                          <option>21</option>
                          <option>22</option>
                          <option>23</option>
                          <option>24</option>
                          <option>25</option>
                          <option>26</option>
                          <option>27</option>
                          <option>28</option>
                          <option>29</option>
                          <option>30</option>
                          <option>31</option>
                        </CSelect>
                      </CFormGroup>
                    </CCol>
                    <CCol xs="4">
                      <CFormGroup>
                        <CLabel htmlFor="ccmonth">Mes</CLabel>
                          <CSelect custom name="ccmonth" id="ccmonth">
                            <option value="January">Enero</option>
                            <option value="February">Febrero</option>
                            <option value="March">Marzo</option>
                            <option value="April">Abril</option>
                            <option value="May">Mayo</option>
                            <option value="June">Junio</option>
                            <option value="July">Julio</option>
                            <option value="August">Agosto</option>
                            <option value="September">Septiembre</option>
                            <option value="October">Octubre</option>
                            <option value="November">Noviembre</option>
                            <option value="December">Deciembre</option>
                          </CSelect>
                        </CFormGroup>
                      </CCol>
                      <CCol xs="4">
                        <CFormGroup>
                          <CLabel htmlFor="ccyear">Año</CLabel>
                          <CSelect custom name="ccyear" id="ccyear">
                            <option>2010</option>
                            <option>2011</option>
                            <option>2012</option>
                            <option>2013</option>
                            <option>2014</option>
                            <option>2015</option>
                            <option>2016</option>
                            <option>2017</option>
                            <option>2018</option>
                            <option>2019</option>
                            <option>2020</option>
                            <option>2021</option>
                            <option>2022</option>
                          </CSelect>
                        </CFormGroup>
                      </CCol>
                    </CRow>
                  </CCardBody>
                </CCard>
                <CFormGroup row>
                  <CCol xs="12" md="6">
                    <CLabel htmlFor="ccyear">Fecha de nacimiento</CLabel>
                    <CInput type="date" id="date-input" name="date-input" placeholder="date" />
                  </CCol>
                </CFormGroup>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default Forms;
