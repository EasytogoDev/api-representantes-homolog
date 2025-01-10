const {
  processaItensImportadosViaExcel,
} = require("../controllers/itensPropostaMysqlController");

const cron = require("node-cron");

// Agendando o cron job
cron.schedule("* * * * *", async () => {
  console.log("Executando tarefas...");
  await processaItensImportadosViaExcel();
  console.log("Cron job executado e log atualizado.");
});
