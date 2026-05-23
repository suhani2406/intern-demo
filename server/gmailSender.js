const nodemailer=require("nodemailer");

async function sendMail(receiver){

const transporter=nodemailer.createTransport({

service:"gmail",

auth:{

user:process.env.GMAIL,

pass:process.env.APP_PASSWORD
}

});

await transporter.sendMail({

from:process.env.GMAIL,

to:receiver,

subject:"Application for Java Developer Contract Role",

text:"Please find my resume attached.",

attachments:[
{
filename:"resume.pdf",
path:"./resume.pdf"
}
]

});

}

module.exports=sendMail;