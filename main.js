const ligaCECBankData = require("./src/liga-cec-bank/main.js");


(async () => {
    let data = await ligaCECBankData.data();

    console.log(data);

})();

