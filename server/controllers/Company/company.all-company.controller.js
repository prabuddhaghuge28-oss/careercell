const CompanySchema = require("../../models/company.model");


const AddCompany = async (req, res) => {
  try {
    // Management users should not be allowed to create companies
    if (req.user && req.user.role === 'management_admin') {
      return res.status(403).json({ msg: 'Forbidden' });
    }
    const companyName = req.body.companyName;
    const companyDescription = req.body.companyDescription;
    const companyWebsite = req.body.companyWebsite;
    const companyLocation = req.body.companyLocation;
    const companyDifficulty = req.body.companyDifficulty;

    if (await CompanySchema.findOne({ companyName: companyName })) {
      return res.json({ msg: "Company Name Already Exist!" })
    }

    const newcmp = new CompanySchema({
      companyName,
      companyDescription,
      companyWebsite,
      companyLocation,
      companyDifficulty
    });

    await newcmp.save();

    return res.status(201).json({ msg: "Company Created Successfully!", });
  } catch (error) {
    console.log("company.all-company.controller.js = AddCompany => ", error);
    return res.status(500).json({ msg: 'Server Error' });
  }
}


const CompanyDetail = async (req, res) => {
  try {
    if (req.query.companyId) {
      const company = await CompanySchema.findById(req.query.companyId);
      return res.json({ company });
    }
  } catch (error) {
    console.log("company.all-company.controller.js = CompanyDetail => ", error);
    return res.status(500).json({ msg: 'Server Error' });
  }
}

const AllCompanyDetail = async (req, res) => {
  try {
    // If management user requests company list, return an empty set
    if (req.user && req.user.role === 'management_admin') {
      return res.json({ companys: [] });
    }
    const companys = await CompanySchema.find();
    return res.json({ companys });
  } catch (error) {
    console.log("company.all-company.controller.js = AllCompanyDetail => ", error);
    return res.status(500).json({ msg: 'Server Error' });
  }
}

const DeleteCompany = async (req, res) => {
  try {
    // Management users are not allowed to delete companies
    if (req.user && req.user.role === 'management_admin') {
      return res.status(403).json({ msg: 'Forbidden' });
    }
    const company = await CompanySchema.findById(req.body.companyId);
    await company.deleteOne();
    return res.json({ msg: "Company Deleted Successfully!" });
  } catch (error) {
    console.log("company.all-company.controller.js = DeleteCompany => ", error);
    return res.status(500).json({ msg: 'Server Error' });
  }
}


module.exports = {
  AddCompany,
  CompanyDetail,
  AllCompanyDetail,
  DeleteCompany
};