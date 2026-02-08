const UserDetail = async (req, res) => {
  // console.log(req.user)
  return res.json({
    id: `${req.user.id}`,
    // common data
    first_name: `${req.user.first_name}`,
    middle_name: `${req.user.middle_name}`,
    last_name: `${req.user.last_name}`,
    email: `${req.user.email}`,
    number: `${req.user.number}`,
    password: `${req.user.password}`,
    profile: `${req.user.profile}`,
    gender: `${req.user.gender}`,
    dateOfBirth: `${req.user.dateOfBirth}`,
    createdAt: `${req.user.createdAt}`,

    fullAddress: {
      address: `${req.user.fullAddress.address}`,
      pincode: `${req.user.fullAddress.pincode}`,
    },

    role: `${req.user.role}`,
    isProfileCompleted: `${req.user.isProfileCompleted}`,

    // student data
    studentProfile: {
      rollNumber: `${req.user.studentProfile.rollNumber}`,
      ABCID: `${req.user.studentProfile.ABCID}`,
      department: `${req.user.studentProfile.department}`,
      year: `${req.user.studentProfile.year}`,
      addmissionYear: `${req.user.studentProfile.addmissionYear}`,
      gap: `${req.user.studentProfile.gap}`,
      liveKT: `${req.user.studentProfile.liveKT}`,
      resume: {
        filename: `${req.user.studentProfile.resume.filename}`,
        filepath: `${req.user.studentProfile.resume.filepath}`,
        contentType: `${req.user.studentProfile.resume.contentType}`,
      },
      SGPA: {
        sem1: `${req.user.studentProfile.SGPA.sem1}`,
        sem2: `${req.user.studentProfile.SGPA.sem2}`,
        sem3: `${req.user.studentProfile.SGPA.sem3}`,
        sem4: `${req.user.studentProfile.SGPA.sem4}`,
        sem5: `${req.user.studentProfile.SGPA.sem5}`,
        sem6: `${req.user.studentProfile.SGPA.sem6}`,
      },
      pastQualification: {
        ssc: {
          board: `${req.user.studentProfile.pastQualification.ssc.board}`,
          percentage: `${req.user.studentProfile.pastQualification.ssc.percentage}`,
          year: `${req.user.studentProfile.pastQualification.ssc.year}`
        },
        hsc: {
          board: `${req.user.studentProfile.pastQualification.hsc.board}`,
          percentage: `${req.user.studentProfile.pastQualification.hsc.percentage}`,
          year: `${req.user.studentProfile.pastQualification.hsc.year}`
        },
        diploma: {
          board: `${req.user.studentProfile.pastQualification.diploma.board}`,
          percentage: `${req.user.studentProfile.pastQualification.diploma.percentage}`,
          year: `${req.user.studentProfile.pastQualification.diploma.year}`
        },
      },
      resultFiles: req.user.studentProfile.resultFiles ? {
        sem1: req.user.studentProfile.resultFiles.sem1 || { filename: 'undefined', filepath: 'undefined', contentType: 'undefined' },
        sem2: req.user.studentProfile.resultFiles.sem2 || { filename: 'undefined', filepath: 'undefined', contentType: 'undefined' },
        sem3: req.user.studentProfile.resultFiles.sem3 || { filename: 'undefined', filepath: 'undefined', contentType: 'undefined' },
        sem4: req.user.studentProfile.resultFiles.sem4 || { filename: 'undefined', filepath: 'undefined', contentType: 'undefined' },
        sem5: req.user.studentProfile.resultFiles.sem5 || { filename: 'undefined', filepath: 'undefined', contentType: 'undefined' },
        sem6: req.user.studentProfile.resultFiles.sem6 || { filename: 'undefined', filepath: 'undefined', contentType: 'undefined' },
        hsc: req.user.studentProfile.resultFiles.hsc || { filename: 'undefined', filepath: 'undefined', contentType: 'undefined' },
        ssc: req.user.studentProfile.resultFiles.ssc || { filename: 'undefined', filepath: 'undefined', contentType: 'undefined' },
        diploma: req.user.studentProfile.resultFiles.diploma || { filename: 'undefined', filepath: 'undefined', contentType: 'undefined' }
      } : {
        sem1: { filename: 'undefined', filepath: 'undefined', contentType: 'undefined' },
        sem2: { filename: 'undefined', filepath: 'undefined', contentType: 'undefined' },
        sem3: { filename: 'undefined', filepath: 'undefined', contentType: 'undefined' },
        sem4: { filename: 'undefined', filepath: 'undefined', contentType: 'undefined' },
        sem5: { filename: 'undefined', filepath: 'undefined', contentType: 'undefined' },
        sem6: { filename: 'undefined', filepath: 'undefined', contentType: 'undefined' },
        hsc: { filename: 'undefined', filepath: 'undefined', contentType: 'undefined' },
        ssc: { filename: 'undefined', filepath: 'undefined', contentType: 'undefined' },
        diploma: { filename: 'undefined', filepath: 'undefined', contentType: 'undefined' }
      },
    }

  });
}

module.exports = UserDetail;