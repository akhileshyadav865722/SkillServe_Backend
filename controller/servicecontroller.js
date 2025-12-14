const Service = require("../models/Service");

/*
1. Recruiter creates a service post
*/
exports.createService = async (req, res) => {
  try {
    console.log("req.body:", req.body);
    console.log("req.user:", req.user);

    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }

    const { title, description, budget, location, roles } = req.body;

    if (!title || !description || !roles || !Array.isArray(roles) || roles.length === 0) {
      return res.status(400).json({ success: false, error: "Title, description, and roles are required" });
    }

    // Ensure each role has roleName and vacancies as Number
    const formattedRoles = roles.map((role) => ({
      roleName: role.roleName,
      vacancies: Number(role.vacancies),
      applicants: [],
    }));

    const service = await Service.create({
      recruiter: req.user.id, // updated here
      title,
      description,
      budget,
      location,
      roles: formattedRoles,
    });

    res.status(201).json({
      success: true,
      message: "Service posted successfully",
      service,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/*
2. Get all services (for applicants)
*/
exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.find()
      .populate("recruiter", "name email")
      .sort({ createdAt: -1 });

    res.json({ success: true, services });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/*
3. Applicant applies for a specific role
*/
exports.applyForRole = async (req, res) => {
  try {
    const { serviceId, roleId } = req.params;

    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    const role = service.roles.id(roleId);
    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }

    const alreadyApplied = role.applicants.some(
      (app) => app.user.toString() === req.user.id.toString()
    );

    if (alreadyApplied) {
      return res.status(400).json({ message: "Already applied for this role" });
    }

    role.applicants.push({ user: req.user.id });
    await service.save();

    res.json({
      success: true,
      message: "Applied successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/*
4. Recruiter views his posted services with role-wise application count
*/
exports.getMyServices = async (req, res) => {
  try {
    const services = await Service.find({ recruiter: req.user.id });

    const formattedServices = services.map((service) => ({
      _id: service._id,
      title: service.title,
      roles: service.roles.map((role) => ({
        roleName: role.roleName,
        vacancies: role.vacancies,
        applications: role.applicants.length,
      })),
    }));

    res.json({ success: true, services: formattedServices });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/*
5. Recruiter views applications for a service
*/
exports.getServiceApplications = async (req, res) => {
  try {
    const service = await Service.findById(req.params.serviceId)
      .populate("roles.applicants.user", "name email");

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    if (service.recruiter.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    res.json({ success: true, service });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/*
6. Recruiter updates applicant status (select / reject)
*/
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { serviceId, roleId, applicantId } = req.params;
    const { status } = req.body; // selected / rejected

    const service = await Service.findById(serviceId);
    const role = service.roles.id(roleId);
    const applicant = role.applicants.id(applicantId);

    applicant.status = status;
    await service.save();

    res.json({ success: true, message: "Status updated" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
