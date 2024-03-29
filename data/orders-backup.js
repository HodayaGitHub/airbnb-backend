export const orders = [
    {
      _id: "o1225",
      hostId: "u102",
      buyer: {
        _id: "u101",
        fullname: "User 1"
      },
      totalPrice: 160,
      startDate: "2025/10/15",
      endDate: "2025/10/17",
      guests: {
        adults: 1,
        kids: 2
      },
      stay: {
        _id: "h102",
        name: "House Of Uncle My",
        price: 80.00
      },
      msgs: [],
      status: "pending" // approved, rejected
    },
  ]