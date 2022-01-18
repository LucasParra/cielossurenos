const nameStateSpanish = (stateID) => {
  switch (stateID) {
    case 1:
      return "activo";
    case 2:
      return "de baja";
    case 3:
      return "moroso";
    case 4:
      return "borrador";
    case 5:
      return "desconexion en proceso";
    case 6:
      return "activacion en proceso";

    default:
      return "indefinido";
  }
};

export { nameStateSpanish };
