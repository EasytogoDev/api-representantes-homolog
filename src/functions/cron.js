const {
  processaItensImportadosViaExcel,
  deletaItensTabelaTemporaria,
} = require("../controllers/itensPropostaMysqlController");

const cron = require("node-cron");

// Agendando o cron job
cron.schedule("* * * * *", async () => {
  console.log("Executando tarefas...");
  await processaItensImportadosViaExcel();
  console.log("Cron job executado e log atualizado.");
});

cron.schedule("0 1 * * *", async () => {
  console.log("Executando tarefas...");
  await deletaItensTabelaTemporaria();
  console.log("Cron job executado e log atualizado.");
});
