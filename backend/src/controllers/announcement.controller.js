const Announcement =
require(
  "../models/announcement.model"
);

exports.createAnnouncement =
async (req, res) => {

  try {

    const announcement =
      await Announcement.create({

        title:
          req.body.title,

        message:
          req.body.message,

        createdBy:
          req.user.id,

      });

    res.status(201).json({

      success: true,

      announcement,

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      message:
        error.message,

    });

  }

};


exports.getAnnouncements =
async (req, res) => {

  try {

    const announcements =
      await Announcement.find()

      .sort({
        createdAt: -1,
      });

    res.status(200).json({

      success: true,

      announcements,

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      message:
        error.message,

    });

  }

};


exports.updateAnnouncement =
async (req, res) => {

  try {

    const announcement =
      await Announcement.findByIdAndUpdate(

        req.params.id,

        req.body,

        {
          new: true,
        }

      );

    res.status(200).json({

      success: true,

      announcement,

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      message:
        error.message,

    });

  }

};


exports.deleteAnnouncement =
async (req, res) => {

  try {

    await Announcement.findByIdAndDelete(
      req.params.id
    );

    res.status(200).json({

      success: true,

      message:
        "Announcement deleted",

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      message:
        error.message,

    });

  }

};