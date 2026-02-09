require("dotenv").config();
require("../db/mongoose");

const AppConfig = require("../models/AppConfig");

async function main() {
  await AppConfig.updateMany({}, { $set: { active: false } });

  await AppConfig.create({
    active: true,
    company: {
      name: "YOUR NAME / COMPANY",
      titleLine1: "Line 1",
      titleLine2: "Line 2",
      address1: "Address line 1",
      address2: "City, Province",
      postal: "POSTAL",
      phone: "000-000-0000",
      email: "email@example.com",
      gstNumber: "GST",
      qstNumber: "QST",
    },
    taxes: {
      gstRate: 0.05,
      qstRate: 0.09975,
    },
  });

  console.log("✅ appconfig seeded");
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
