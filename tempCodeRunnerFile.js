//packages
const axios = require("axios");
const cheerio = require("cheerio");
require("dotenv").config();
const client = require("@sendgrid/mail");
client.setApiKey(process.env.SENDGRID_API_KEY);

const url =
  "https://www.xe.com/zh-CN/currencyconverter/convert/?Amount=1&From=NOK&To=CNY";

//Set interval
setInterval(scrape, 43200000);

async function scrape() {
  // fetch the data
  const { data } = await axios.get(url);
  //load up the html
  const $ = cheerio.load(data);
  const form = $("form");
  const rateForm = $(form).find("p");
  const rate = rateForm.text();
  console.log(rate);

  client
    .send({
      to: process.env.MY_SECRET_EMAIL,
      from: process.env.MY_SECRET_EMAIL,
      subject: "今日汇率",
      html: `${rate}`,
    })
    .then(() => {
      console.log("done");
    })
    .catch((err) => {
      console.log("Shit~~" + err);
    });
}

scrape();
