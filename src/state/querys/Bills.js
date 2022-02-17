import moment from "moment";

const myHeaders = new Headers();
myHeaders.append("access_token", "bc58910097a6d35d4049ff5d49b46c1da34ddbec");
myHeaders.append("Content-Type", "application/json");

const generateBill = (user, charges) => {
  const body = JSON.stringify({
    documentTypeId: user.Business ? 11 : 10,
    officeId: 1,
    coinId: 1,
    emissionDate: moment().unix(),
    expirationDate: moment().unix(),
    exchangeRate: charges.reduce(
      (previousValue, currentValue) => previousValue + currentValue.value,
      0
    ),
    exportNetAmount: charges.reduce(
      (previousValue, currentValue) => previousValue + currentValue.value,
      0
    ),
    exportTaxAmount: 0,
    exportTotalAmount: charges.reduce(
      (previousValue, currentValue) => previousValue + currentValue.value,
      0
    ),
    exportExemptAmount: charges.reduce(
      (previousValue, currentValue) => previousValue + currentValue.value,
      0
    ),
    client: {
      city: "Temuco",
      company: `${user.Names} ${user.LastName}`,
      code: user.Rut,
      municipality: user?.UserAddress[0]?.Address.AddressZoneID.Name,
      activity: "Importadores",
      address: `${user?.UserAddress[0]?.Address.AddressName} ${user?.UserAddress[0]?.Address.AddressNumber}`,
      isForeigner: 1,
    },
    details: charges.map((charge) => ({
      netUnitValue: charge.value,
      quantity: 1,
      code: "pts",
      comment: charge.name,
      discount: 0,
      exportNetAmount: charge.value,
      exportTaxAmount: 0,
      exportTotalAmount: charge.value,
    })),
  });
  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body,
    redirect: "follow",
  };

  return fetch("https://api.bsale.cl/v1/documents.json", requestOptions)
    .then((response) => response.json())
    .then((result) => result)
    .catch((error) => console.log("error", error));
};

const getDetailsDocumentID = (documentID) => {
  return fetch(`https://api.bsale.cl/v1/documents/${documentID}/details.json`, {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  })
    .then((response) => response.json())
    .then((result) => result)
    .catch((error) => console.log("error", error));
};

const creditNote = (user, documentID, detailID) => {
  const body = JSON.stringify({
    motive: "prueba api",
    declareSii: 1,
    priceAdjustment: 0,
    editTexts: 0,
    type: 1,
    documentTypeId: 12,
    officeId: 1,
    emissionDate: moment().unix(),
    expirationDate: moment().unix(),
    referenceDocumentId: documentID,
    priceListId: 27,
    client: {
      city: "Temuco",
      company: `${user.Names} ${user.LastName}`,
      code: user.Rut,
      municipality: user?.UserAddress[0]?.Address.AddressZoneID.Name,
      activity: "Importadores",
      address: `${user?.UserAddress[0]?.Address.AddressName} ${user?.UserAddress[0]?.Address.AddressNumber}`,
      isForeigner: 1,
    },
    details: [
      {
        documentDetailId: detailID,
        quantity: 1,
        unitValue: 0,
      },
    ],
    payments: [
      {
        recordDate: 1565095797,
        amount: 11900,
        paymentTypeId: 10,
      },
    ],
  });
  // var body = JSON.stringify({
  //   documentTypeId: 12,
  //   officeId: 1,

  //   motive: "prueba api",
  //   declareSii: 1,
  //   priceAdjustment: 0,
  //   editTexts: 0,
  //   type: 1,

  //   // priceListId: 27,

  //   // documentTypeId: 9,
  //   // officeId: 1,

  //   details: [
  //     {
  //       netUnitValue: 10000,
  //       quantity: 1,
  //       taxId: "[1]",
  //       comment: "el nombre del producto que voy a vender",
  //       discount: 0,
  //     },
  //   ],
  //   // payments: [
  //   //   {
  //   //     recordDate: 1565095797,
  //   //     amount: 11900,
  //   //     paymentTypeId: 10,
  //   //   },
  //   // ],
  // });

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: body,
    redirect: "follow",
  };

  return fetch("https://api.bsale.cl/v1/returns.json", requestOptions)
    .then((response) => response.json())
    .then((result) => result)
    .catch((error) => console.log("error", error));
};

export { generateBill, creditNote, getDetailsDocumentID };
