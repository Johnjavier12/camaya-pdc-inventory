const computeDiscount = (trip1_rate, passengers, seniorData) => {
    
    let total_passengers = passengers.adult_passengers.length + passengers.kid_passengers.length;
    let excess = total_passengers%2;
    let total_promo_discount = (trip1_rate*(total_passengers-excess)*0.5);
    let total_senior_discount = seniorData.index != -1 && seniorData.index != null ? (trip1_rate*0.2) : 0;

    return {
        totalEligiblePassenger: total_passengers,
        excess: excess,
        totalSeniorDiscount: total_senior_discount,
        totalBuy1Take1Discount: total_promo_discount,
    };
};

const setPassengersDiscounts = (passengers, p_type, index, bookingForm) => {
    let eligible = (passengers.adult_passengers.length + passengers.kid_passengers.length);
    let buy1take1Passengers = eligible - (eligible%2);

    console.log(p_type);
    const newPassengers = passengers;
    ['adult_passengers', 'kid_passengers'].forEach(type => {
      newPassengers[type] = newPassengers[type].map((passenger, i) => {
        if(buy1take1Passengers>0) {
            if(!(p_type === type && i === index)){
                buy1take1Passengers--;
                return {...passenger, discount_id: 'Buy1Take1',  is_discounted: true};
            }
        }
        return {...passenger};
      });
    });
    
    console.log(newPassengers);
      
    return newPassengers;
}


export default {
    computeDiscount,
    setPassengersDiscounts,
}