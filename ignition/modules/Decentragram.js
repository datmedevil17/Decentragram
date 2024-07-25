const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");



module.exports = buildModule("Decentragram", (m) => {


  const Decentragram = m.contract("Decentragram", []);

  return { Decentragram };
});


