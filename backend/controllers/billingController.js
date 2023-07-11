const Timeslip = require('../model/timeslipModel')
const asyncHandler = require('express-async-handler')

// @desc    Get billable totals using search criteria
// @route   GET /api/billing
// @access  Public
const getBillable = asyncHandler(async (req, res) => {
  const { claim, lastdate } = req.query

  let condition = {}
  if (lastdate) {
    condition['date'] = {
      $lte: new Date(lastdate),
    }
  }
  condition['billable'] = true
  condition['billed'] = false

  const billables = await Timeslip.aggregate([
    {
      $match: condition,
    },
    {
      $project: {
        _id: 0,
        claimId: '$claim',
        hours: 1,
        rate: 1,
        extended: {
          $multiply: ['$hours', '$rate'],
        },
      },
    },
    {
      $group: {
        _id: '$claimId',
        hours: {
          $sum: '$hours',
        },
        time: {
          $sum: '$extended',
        },
        extendedTime: {
          $sum: '$extended',
        },
      },
    },
    {
      $unionWith: {
        coll: 'charges',
        pipeline: [
          {
            $match: condition,
          },
          {
            $project: {
              _id: 0,
              claimId: '$claim',
              amount: 1,
            },
          },
          {
            $group: {
              _id: '$claimId',
              charges: {
                $sum: '$amount',
              },
              extendedCharges: {
                $sum: '$amount',
              },
            },
          },
        ],
      },
    },
    {
      $unionWith: {
        coll: 'claims',
        pipeline: [
          {
            $project: {
              _id: 1,
              name: 1,
            },
          },
        ],
      },
    },
    {
      $group: {
        _id: '$_id',
        claimName: {
          $last: '$name',
        },
        billableHours: {
          $sum: '$hours',
        },
        billableTime: {
          $sum: '$time',
        },
        billableCharges: {
          $sum: '$charges',
        },
      },
    },
    {
      $match: {
        claimName: { $regex: new RegExp(claim), $options: 'i' },
        $or: [
          {
            billableTime: {
              $ne: 0,
            },
          },
          {
            billableCharges: {
              $ne: 0,
            },
          },
        ],
      },
    },
  ]).sort({
    claimName: 1,
  })

  res.json(billables)
})

module.exports = { getBillable }
