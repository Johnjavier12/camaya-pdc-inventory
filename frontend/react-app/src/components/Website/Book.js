// things that need to enhance
//enhance book js by reusing booking form, use redux for discount and disabling button.
//enhance use effect and use callback hooks, minimizing use state

import React, { useState, useEffect } from "react";
import WebsiteLayout from "layouts/Main/Website/WebsiteLayout";
import Navigation from "layouts/Main/Website/Navigation";
import {
  DatePicker,
  Select,
  Button,
  Card,
  Form,
  Input,
  Descriptions,
  message,
  Space,
  Checkbox,
  Divider,
} from "antd";
import moment from "moment";
import FerryIcon from "assets/ferryicon.png";
import BookingService from "services/Booking/BookingService";
import _, { over } from "lodash";
import { ShowIf, currencyFormat } from "utils/Common";
import CreditCardLogo from "assets/Credit-Card.png";
import { useLocation } from "react-router-dom";
import StickyBox from "react-sticky-box";
import LogicService from "services/Booking/LogicService";

function Page(props) {
  const search = useLocation().search;
  const status = new URLSearchParams(search).get("status");
  const isBuy1Take1PromoActive = true;
  const passengerOptions = {
    min_adult: 1,
    max_adult: 10,

    min_kid: 0,
    max_kid: 5,

    min_infant: 0,
    max_infant: 3,
  };

  const location_name = {
    CMY: "Camaya Coast",
    EST: "Esplanade Seaside Terminal",
    FTT: "FAB Town Terminal",
  };

  const [step, setStep] = useState(1);
  const [isSenior, setIsSenior] = useState(false);
  const [seniorData, setSeniorData] = useState({
    type: null,
    index: null,
    name: null,
  });
  const [selectedDate, setSelectedDate] = useState(moment());
  const [referenceNumber, setReferenceNumber] = useState("");
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [roundTrip, setRoundTrip] = useState(false);
  const [locations, setLocations] = useState({
    origin: null,
    destination: null,
  });
  const [totalPassengers, setTotalPassengers] = useState({
    adult: 0,
    kid: 0,
    infant: 0,
  });
  const [availableTrips, setAvailableTrips] = useState([]);
  const [searched, setSearched] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState({ id: null });
  const [selectedTrip2, setSelectedTrip2] = useState({ id: null });
  const [passengers, setPassengers] = useState({
    adult_passengers: [],
    kid_passengers: [],
    infant_passengers: [],
  });

  const [
    getAvailableTripsQuery,
    {
      isLoading: getAvailableTripsQueryIsLoading,
      reset: getAvailableTripsQueryReset,
    },
  ] = BookingService.getAvailableTrips();
  const [
    bookFerryTripQuery,
    { isLoading: bookFerryTripQueryIsLoading, reset: bookFerryTripQueryReset },
  ] = BookingService.bookFerryTrip();

  const [bookingForm] = Form.useForm();

  useEffect(() => {
    if (status) {
      setStep(5);
    }
  }, []);

  //need enhancement
  useEffect(() => {
    const adult_passengers = bookingForm.getFieldValue("adult_passengers");
    const kid_passengers = bookingForm.getFieldValue("kid_passengers");
    const infant_passengers = bookingForm.getFieldValue("infant_passengers");

    setPassengers({
      adult_passengers: _.map(_.range(totalPassengers.adult), (i) => ({
        is_discounted: adult_passengers[i]?.is_discounted ?? false,
      })),
      kid_passengers: _.map(_.range(totalPassengers.kid), (i) => ({
        is_discounted: kid_passengers[i]?.is_discounted ?? false,
      })),
      infant_passengers: _.map(_.range(totalPassengers.infant), (i) => ({
        is_discounted: infant_passengers[i]?.is_discounted ?? false,
      })),
    });

    bookingForm.setFieldsValue({
      adult_passengers: _.map(_.range(totalPassengers.adult), (i) => ({
        first_name: adult_passengers[i]?.first_name,
        last_name: adult_passengers[i]?.last_name,
        age: adult_passengers[i]?.age,
        nationality: adult_passengers[i]?.nationality ?? "Filipino",
        is_discounted: adult_passengers[i]?.is_discounted ?? false,
        discount_id: adult_passengers[i]?.discount_id,
      })),
      kid_passengers: _.map(_.range(totalPassengers.kid), (i) => ({
        first_name: kid_passengers[i]?.first_name,
        last_name: kid_passengers[i]?.last_name,
        age: kid_passengers[i]?.age,
        nationality: kid_passengers[i]?.nationality ?? "Filipino",
        is_discounted: kid_passengers[i]?.is_discounted ?? false,
        discount_id: kid_passengers[i]?.discount_id,
      })),
      infant_passengers: _.map(_.range(totalPassengers.infant), (i) => ({
        first_name: infant_passengers[i]?.first_name,
        last_name: infant_passengers[i]?.last_name,
        age: infant_passengers[i]?.age,
        nationality: infant_passengers[i]?.nationality ?? "Filipino",
        is_discounted: infant_passengers[i]?.is_discounted ?? false,
        discount_id: infant_passengers[i]?.discount_id,
      })),
    });

    resetTrips();

    // reset the checked checkbox if the user changes the number of passenger
    if (seniorData.type != null && seniorData.index != null) {
      setPassengers((prev) => {
        prev[seniorData.type][seniorData.index].is_discounted = false;
        return { ...prev };
      });
    }

    // disable checkboxes if all passengers are discounted, reset isSenior and seniorData
    if ((totalPassengers.adult + totalPassengers.kid) % 2 === 0) {
      setIsSenior(true);
      setSeniorData({ type: null, index: -1 });
    } else {
      setIsSenior(false);
      setSeniorData({ type: null, index: null });
    }
  }, [totalPassengers]);

  useEffect(() => {
    // console.log(selectedTrip);

    if (roundTrip === false && selectedTrip.id) {
      setStep(3);
    }

    if (roundTrip && selectedTrip.id && selectedTrip2.id) {
      setStep(3);
    }
  }, [selectedTrip.id, selectedTrip2.id]);

  //need enhancement
  useEffect(() => {
    resetTrips();
  }, [selectedDate]);

  useEffect(() => {
    if (selectedRoute) {
      const [origin, destination] = selectedRoute.split("_");

      setLocations({
        origin: location_name[origin],
        destination: location_name[destination],
      });
    }
  }, [selectedRoute]);

  const resetTrips = () => {
    setSelectedTrip({ id: null });
    setSelectedTrip2({ id: null });
    setAvailableTrips([]);
    setLocations({
      origin: null,
      destination: null,
    });
    setSearched(false);
  };

  const bookingAgain = () => {
    location.reload()
    resetTrips();
    setSelectedRoute(null);
    setStep(1);
    setTotalPassengers({
      adult: 0,
      kid: 0,
      infant: 0,
    });
    props.history.push("/book");
  };

  const onChange = (date, dateString) => {
    console.log(date, dateString);
    setSelectedDate(date);
  };

  const disabledDate = (current) => {
    if (!selectedDate) {
      return false;
    }

    const previousDates =
      selectedDate && current.isBefore(moment().subtract(1, "days"));

    return !!previousDates;
  };

  const tripSearch = () => {
    if (getAvailableTripsQueryIsLoading) {
      return false;
    }

    if (totalPassengers.adult === 0) {
      message.warning("Please select passenger");
      return false;
    }

    if (!selectedRoute) {
      message.warning("Please select route");
      return false;
    }

    setStep(2);

    getAvailableTripsQuery(
      {
        selected_date: selectedDate,
        selected_route: selectedRoute,
        total_passengers: totalPassengers,
      },
      {
        onSuccess: (res) => {
          // console.log(res)
          setSearched(true);
          setAvailableTrips(res.data);

          getAvailableTripsQueryReset();
        },
        onError: (e) => {
          console.log(e);
          getAvailableTripsQueryReset();
        },
      }
    );
  };

  const handleIsDiscountedChange = (type, index, checked) => {
    // allow only 1 senior citizen discount if buy1take1 promo is active
    if (checked) {
      // if no senior checkbox has been selected yet, store the index and type
      if (!isSenior) {
        setIsSenior(true);
        setSeniorData({ type, index });
        setPassengers((prev) => {
          prev[type][index].is_discounted = true;
          return { ...prev };
        });
      }
    } else {
      // if the checkbox being deselected is the stored index, reset stored values
      if (isSenior && seniorData.type === type && seniorData.index === index) {
        setIsSenior(false);
        setSeniorData({ type: null, index: null });
        setPassengers((prev) => {
          prev[type][index].is_discounted = false;
          return { ...prev };
        });
      }
    }
  };

  const AvailableTrips = ({ type }) => {
    if (searched === false) {
      return <>Trips will display here.</>;
    }

    if (getAvailableTripsQueryIsLoading) {
      return <>Loading trips..</>;
    }

    if (availableTrips.length === 0) {
      return <>No available trips.</>;
    }

    const [origin, destination] = selectedRoute.split("_");

    // console.log(type, destination);

    return availableTrips
      .filter((i) => {
        if (type === "first_trip" && i.destination_code === destination) {
          return true;
        } else if (type === "second_trip" && i.destination_code === origin) {
          return true;
        } else {
          return false;
        }
      })
      .map((i, k) => (
        <Card
          key={k}
          className="available-trips"
          style={{
            boxShadow:
              selectedTrip.id == i.id || selectedTrip2.id == i.id
                ? "0px 0px 0px 2px limegreen"
                : "inherit",
            zIndex: selectedTrip.id == i.id || selectedTrip2.id == i.id ? 5 : 0,
          }}
        >
          <div className="grid gap-4 grid-cols-2 md:grid-cols-6">
            <div>
              <div className="circle-icon">
                <img src={FerryIcon} className="ferry-icon" />
              </div>
            </div>

            <div className="grid gap-4 grid-cols-2">
              <div>
                <small>Departure time</small>
                <div className="text-2xl">
                  {moment(i.trip_date + " " + i.start_time).format("hA")}
                </div>
              </div>
              <div>
                <small>Arrival time</small>
                <div className="text-1xl">
                  {moment(i.trip_date + " " + i.end_time).format("hA")}
                </div>
              </div>
            </div>

            <div>
              <small>Trip</small>
              <div>TRIP-{i.id}</div>
            </div>

            <div>
              <small>Rate</small>
              <div>PHP {i.rate}</div>
            </div>

            <div>
              <small>Remaining Seats</small>
              <div>{i.available}</div>
            </div>

            <div className="flex self-center justify-center">
              <ShowIf cond={type === "first_trip"}>
                {selectedTrip.id == i.id ? (
                  <div className="flex flex-col grid justify-items-center">
                    <svg
                      className="w-10 h-10"
                      fill="none"
                      stroke="#32cd32"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                    <Button
                      type="link"
                      size="small"
                      danger
                      onClick={() => setSelectedTrip({ id: null })}
                    >
                      remove
                    </Button>
                  </div>
                ) : (
                  <Button
                    disabled={i.remaining_seats < 0}
                    size="small"
                    block
                    type="primary"
                    style={{ borderRadius: 7 }}
                    onClick={() => setSelectedTrip(i)}
                  >
                    {i.remaining_seats < 0 ? "Trip full" : "Select Trip"}
                  </Button>
                )}
              </ShowIf>
              <ShowIf cond={type === "second_trip"}>
                {selectedTrip2.id == i.id ? (
                  <div className="flex flex-col grid justify-items-center">
                    <svg
                      className="w-10 h-10"
                      fill="none"
                      stroke="#32cd32"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                    <Button
                      type="link"
                      size="small"
                      danger
                      onClick={() => setSelectedTrip2({ id: null })}
                    >
                      remove
                    </Button>
                  </div>
                ) : (
                  <Button
                    disabled={i.remaining_seats < 0}
                    size="small"
                    block
                    type="primary"
                    style={{ borderRadius: 7 }}
                    onClick={() => setSelectedTrip2(i)}
                  >
                    {i.remaining_seats < 0 ? "Trip full" : "Select Trip"}
                  </Button>
                )}
              </ShowIf>
            </div>
          </div>
        </Card>
      ));
  };

  const BookingSummary = () => {
    // if (! selectedTrip.id) {
    //   return <></>
    // }

    const trip1_rate = selectedTrip.rate
      ? (parseFloat(selectedTrip.rate) * 10) / 10
      : 0;
    const trip2_rate = selectedTrip2.rate
      ? (parseFloat(selectedTrip2.rate) * 10) / 10
      : 0;

    const adultTotal =
      totalPassengers.adult *
      parseFloat(trip1_rate + (roundTrip ? trip2_rate : 0));
    const kidTotal =
      totalPassengers.kid *
      parseFloat(trip1_rate + (roundTrip ? trip2_rate : 0));

    let discounts1 = 0;
    let discounts2 = 0;
    let total_before_discount = 0;

    if (isBuy1Take1PromoActive) {
      const res = LogicService.computeDiscount(
        trip1_rate,
        passengers,
        seniorData
      );
      discounts1 = res.totalSeniorDiscount;
      discounts2 = res.totalBuy1Take1Discount;
      total_before_discount = adultTotal + kidTotal;
    } else {
      discounts1 =
        (passengers.adult_passengers.filter((i) => i.is_discounted === true)
          .length +
          passengers.kid_passengers.filter((i) => i.is_discounted === true)
            .length) *
        (trip1_rate * 0.2);
      discounts2 =
        (passengers.adult_passengers.filter((i) => i.is_discounted === true)
          .length +
          passengers.kid_passengers.filter((i) => i.is_discounted === true)
            .length) *
        (trip2_rate * 0.2);
    }

    const total = total_before_discount - discounts1 - discounts2;

    return (
      <div style={{ width: "100%" }}>
        <Card
          bodyStyle={{
            background: "#e8f4f8",
            borderRadius: 7,
            boxShadow: "0px 0px 0px 1px skyblue inset",
          }}
        >
          <h1 className="text-1xl tracking-tight font-bold text-gray-900 sm:text-1xl md:text-1xl">
            <span className="block xl:inline">Booking summary</span>
          </h1>

          <ShowIf cond={selectedTrip.id} className="mb-2">
            <Card>
              <Descriptions size="small" bordered>
                <Descriptions.Item span={3} label="Trip Date">
                  {selectedDate.format("MMM D YYYY")}
                </Descriptions.Item>
                <Descriptions.Item span={3} label="Pax">
                  <Space>
                    <div>
                      {totalPassengers.adult}
                      <br />
                      <small>Adult</small>
                    </div>
                    <div>
                      {totalPassengers.kid}
                      <br />
                      <small>Kid</small>
                    </div>
                    <div>
                      {totalPassengers.infant}
                      <br />
                      <small>Infant</small>
                    </div>
                  </Space>
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </ShowIf>

          <ShowIf cond={selectedTrip.id}>
            <div className="ticket">
              <Descriptions size="small" bordered style={{ width: "100%" }}>
                <Descriptions.Item span={3} label="Route">
                  <strong>
                    {selectedTrip.origin_code} to{" "}
                    {selectedTrip.destination_code}
                  </strong>
                </Descriptions.Item>
                <Descriptions.Item span={3} label="Trip">
                  TRIP-{selectedTrip.id}
                </Descriptions.Item>
                <Descriptions.Item span={3} label="Time">
                  {moment(
                    selectedTrip.trip_date + " " + selectedTrip.start_time
                  ).format("hA")}{" "}
                  -{" "}
                  {moment(
                    selectedTrip.trip_date + " " + selectedTrip.end_time
                  ).format("hA")}
                </Descriptions.Item>
                <Descriptions.Item span={3} label="Rate">
                  PHP {selectedTrip.rate}
                </Descriptions.Item>
                {discounts1 && (
                  <Descriptions.Item span={3} label="Discount">
                    PHP {discounts1.toFixed(2)}
                  </Descriptions.Item>
                )}

                {/* <Descriptions.Item label="Total Ticket Amount">PHP {currencyFormat(total)}</Descriptions.Item> */}
              </Descriptions>
            </div>
          </ShowIf>

          <ShowIf cond={selectedTrip2.id}>
            <div className="ticket">
              <Descriptions size="small" bordered style={{ width: "100%" }}>
                <Descriptions.Item span={3} label="Route">
                  <strong>
                    {selectedTrip2.origin_code} to{" "}
                    {selectedTrip2.destination_code}
                  </strong>
                </Descriptions.Item>
                <Descriptions.Item span={3} label="Trip">
                  TRIP-{selectedTrip2.id}
                </Descriptions.Item>
                <Descriptions.Item span={3} label="Time">
                  {moment(
                    selectedTrip2.trip_date + " " + selectedTrip2.start_time
                  ).format("hA")}{" "}
                  -{" "}
                  {moment(
                    selectedTrip2.trip_date + " " + selectedTrip2.end_time
                  ).format("hA")}
                </Descriptions.Item>
                <Descriptions.Item span={3} label="Rate">
                  PHP {selectedTrip2.rate}
                </Descriptions.Item>
                {discounts2 && (
                  <Descriptions.Item span={3} label="Discount">
                    PHP {discounts2.toFixed(2)}
                  </Descriptions.Item>
                )}

                {/* <Descriptions.Item label="Total Ticket Amount">PHP {currencyFormat(total)}</Descriptions.Item> */}
              </Descriptions>
            </div>
          </ShowIf>

          <ShowIf cond={selectedTrip.id}>
            <Card>
              <div>
                <div className="flex justify-between">
                  <p>Regular Rate:</p>
                  <p>PHP {currencyFormat(total_before_discount.toFixed(2))}</p>
                </div>
                <div className="flex justify-between">
                  <p>Promo Discount:</p>
                  <p>PHP {currencyFormat(discounts2.toFixed(2))}</p>
                </div>
                <div className="flex justify-between">
                  <p>Senior Discount:</p>
                  <p>PHP {currencyFormat(discounts1.toFixed(2))}</p>
                </div>
              </div>
              <Divider />
              <div className="flex justify-between font-semibold">
                <p>Total Ticket Amount:</p>
                <p>PHP {currencyFormat(total.toFixed(2))}</p>
              </div>
            </Card>
          </ShowIf>
        </Card>
      </div>
    );
  };

  const bookingFormFinish = (values) => {
    console.log(values);

    console.log("trip: ", selectedTrip);

    if (bookFerryTripQueryIsLoading) {
      return false;
    }

    LogicService.setPassengersDiscounts(
      values,
      seniorData.type,
      seniorData.index,
      bookingForm
    );

    setStep(4);

    bookFerryTripQuery(
      {
        ...values,
        seat_segment_id: selectedTrip.id,
        seat_segment_id2: selectedTrip2.id ?? null,
        round_trip: roundTrip,
      },
      {
        onSuccess: (res) => {
          if (res.data.status === "OK") {
            bookingForm.resetFields();
            setReferenceNumber(res.data.reference_number);
            // window.open(`${res.data.page}`, "width=800, height=800");
            setStep(5);
        
            // message.success(
            //   "Trip reserved! Please continue for payment confirmationl."
            // );
            // bookingForm.resetFields();

        
          }
        },
        onError: (e) => {
          message.error(e.message);
        },
      }
    );
    //
  };

  return (
    <WebsiteLayout>
      <Navigation />
      <ShowIf cond={step !== 5}>
        <div className="p-5">
          <h1 className="text-2xl tracking-tight font-extrabold text-gray-900 sm:text-3xl md:text-4xl">
            <span className="block xl:inline">Book your trip</span>
          </h1>

          <div className="grid grid-cols-3 relative gap-4 flex flex-start">
            <div className="col-span-3 md:col-span-2">
              <ShowIf cond={step === 1}>
                <strong className="block">Step 1</strong>
              </ShowIf>

              <ShowIf
                cond={step === 1}
                className="grid grid-cols-6 gap-4 flex-start"
              >
                <div className="onebits-booking-form flex flex-col col-span-6 md:col-span-2">
                  <span>Select trip date</span>
                  <DatePicker
                    allowClear={false}
                    className="onebits"
                    disabledDate={disabledDate}
                    value={selectedDate}
                    placeholder="Select trip date"
                    onChange={onChange}
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      borderRadius: 7,
                    }}
                  />
                </div>

                <div className="onebits-booking-form flex flex-col">
                  <span>Adult</span>
                  <Select
                    value={totalPassengers.adult}
                    className="onebits"
                    placeholder="How many?"
                    onChange={(e) =>
                      setTotalPassengers((old) => ({ ...old, adult: e }))
                    }
                    style={{ width: "100%" }}
                  >
                    {_.map(
                      _.range(
                        passengerOptions.min_adult,
                        passengerOptions.max_adult + 1
                      ),
                      (i) => {
                        return (
                          <Select.Option key={i} value={i}>
                            {i}
                          </Select.Option>
                        );
                      }
                    )}
                  </Select>
                  <small>(12 yrs. old & above)</small>
                </div>

                <div className="onebits-booking-form flex flex-col">
                  <span>Kid</span>
                  <Select
                    value={totalPassengers.kid}
                    className="onebits"
                    placeholder="How many?"
                    onChange={(e) =>
                      setTotalPassengers((old) => ({ ...old, kid: e }))
                    }
                    style={{ width: "100%" }}
                  >
                    {_.map(
                      _.range(
                        passengerOptions.min_kid,
                        passengerOptions.max_kid + 1
                      ),
                      (i) => {
                        return (
                          <Select.Option key={i} value={i}>
                            {i}
                          </Select.Option>
                        );
                      }
                    )}
                  </Select>
                  <small>(3-11 yrs. old)</small>
                </div>

                <div className="onebits-booking-form flex flex-col">
                  <span>Infant</span>
                  <Select
                    value={totalPassengers.infant}
                    className="onebits"
                    placeholder="How many?"
                    onChange={(e) =>
                      setTotalPassengers((old) => ({ ...old, infant: e }))
                    }
                    style={{ width: "100%" }}
                  >
                    {_.map(
                      _.range(
                        passengerOptions.min_infant,
                        passengerOptions.max_infant + 1
                      ),
                      (i) => {
                        return (
                          <Select.Option key={i} value={i}>
                            {i}
                          </Select.Option>
                        );
                      }
                    )}
                  </Select>
                  <small>(below 2 yrs. old)</small>
                </div>

                <div className="onebits-booking-form flex flex-col col-span-3">
                  <span>Route</span>
                  <Select
                    value={selectedRoute}
                    placeholder="Select route"
                    className="onebits"
                    onChange={(e) => setSelectedRoute(e)}
                    style={{ width: "100%" }}
                  >
                    <Select.Option value={"EST_FTT"}>
                      Esplanade Seaside Terminal (EST) - FAB Town Terminal (FTT)
                    </Select.Option>
                    <Select.Option value={"FTT_EST"}>
                      FAB Town Terminal (FTT) - Esplanade Seaside Terminal (EST)
                    </Select.Option>
                    <Select.Option value={"EST_CMY"}>
                      Esplanade Seaside Terminal (EST) - Camaya Coast
                    </Select.Option>
                  </Select>
                </div>

                {/* <div className="flex justify-start md:justify-start lg:justify-center items-center col-span-3 md:col-span-1">
                  <Button
                    style={{ borderRadius: 7 }}
                    type="default"
                    onClick={() => setRoundTrip(!roundTrip)}
                  >
                    {roundTrip ? "Go One-way" : "Go Roundtrip"}
                  </Button>
                </div> */}

                <div className="flex justify-center md:justify-start lg:justify-center items-center">
                  <Button
                    style={{ borderRadius: 7 }}
                    type="primary"
                    onClick={() => tripSearch()}
                  >
                    Search trips
                  </Button>
                </div>
              </ShowIf>

              <ShowIf cond={step === 2}>
                <Button
                  size="small"
                  type="link"
                  onClick={() => setStep(1)}
                  style={{ display: "inline-block" }}
                >
                  &lt; go back
                </Button>
                <strong className="block">Step 2</strong>
                <h1 className="text-1xl tracking-tight font-bold text-gray-900 sm:text-2xl md:text-2xl">
                  <span className="block xl:inline">Select desired trip</span>
                </h1>

                <ShowIf cond={availableTrips && searched}>
                  <ShowIf style={{ display: "inline" }} cond={selectedRoute}>
                    {locations.origin}
                  </ShowIf>{" "}
                  ~{" "}
                  <ShowIf style={{ display: "inline" }} cond={selectedRoute}>
                    {locations.destination}
                  </ShowIf>
                  <AvailableTrips type="first_trip" />
                  <div className="mt-6"></div>
                  <ShowIf cond={roundTrip}>
                    <ShowIf style={{ display: "inline" }} cond={selectedRoute}>
                      {locations.destination}
                    </ShowIf>{" "}
                    ~{" "}
                    <ShowIf style={{ display: "inline" }} cond={selectedRoute}>
                      {locations.origin}
                    </ShowIf>
                    <AvailableTrips type="second_trip" />
                  </ShowIf>
                </ShowIf>

                <ShowIf cond={!searched}>
                  <Card>
                    <span className="block xl:inline">
                      Trips will display here
                    </span>
                  </Card>
                </ShowIf>
              </ShowIf>

              <ShowIf cond={step === 3}>
                <Button
                  size="small"
                  type="link"
                  onClick={() => {
                    setStep(2);
                  }}
                  style={{ display: "inline-block" }}
                >
                  &lt; go back
                </Button>
                <strong className="block">Step 3</strong>
                <Form
                  layout="vertical"
                  form={bookingForm}
                  onFinish={bookingFormFinish}
                >
                  <h1 className="text-1xl tracking-tight font-bold text-gray-900 sm:text-2xl md:text-2xl">
                    <span className="block xl:inline">Passengers</span>
                  </h1>

                  <div className="grid grid-cols-3 gap-2">
                    <Form.Item
                      className="col-span-3 md:col-span-1"
                      name="address"
                      label="Address"
                      rules={[{ required: true }]}
                    >
                      <Input.TextArea
                        placeholder="Passenger address"
                        style={{ borderRadius: 7 }}
                      />
                    </Form.Item>

                    <Form.Item
                      className="col-span-3 md:col-span-1"
                      name="email"
                      label="Email address"
                      rules={[{ required: true }]}
                    >
                      <Input
                        placeholder="Email address"
                        style={{ borderRadius: 7 }}
                      />
                    </Form.Item>

                    <Form.Item
                      className="col-span-3 md:col-span-1"
                      name="contact_number"
                      label="Contact number"
                      rules={[{ required: true }]}
                    >
                      <Input
                        placeholder="Contact number"
                        style={{ borderRadius: 7 }}
                      />
                    </Form.Item>
                  </div>

                  <ShowIf
                    cond={
                      totalPassengers.adult === 0 &&
                      totalPassengers.kid === 0 &&
                      totalPassengers.infant === 0
                    }
                  >
                    <Card>Passenger details</Card>
                  </ShowIf>

                  <ShowIf
                    className="font-bold"
                    cond={totalPassengers.adult > 0}
                  >
                    Adult passengers
                  </ShowIf>
                  <Form.List name="adult_passengers">
                    {(fields, { add, remove }) => {
                      // addPax['adultPax'] = add; removePax['adultPax'] = remove;
                      return fields.map((field) => (
                        <React.Fragment key={field.key}>
                          <div className="grid grid-cols-6 gap-2">
                            <Form.Item
                              name={[field.name, "first_name"]}
                              className="col-span-3 md:col-span-2"
                              style={{ marginBottom: 0 }}
                              rules={[
                                {
                                  required: true,
                                  message: `#${
                                    field.name + 1
                                  } first name is required`,
                                },
                              ]}
                            >
                              <Input
                                placeholder={`#${field.name + 1} first name`}
                                style={{ textTransform: "uppercase" }}
                              />
                            </Form.Item>
                            <Form.Item
                              name={[field.name, "last_name"]}
                              className="col-span-3 md:col-span-2"
                              style={{ marginBottom: 0 }}
                              rules={[
                                {
                                  required: true,
                                  message: `#${
                                    field.name + 1
                                  } last name is required`,
                                },
                              ]}
                            >
                              <Input
                                placeholder={`#${field.name + 1} last name`}
                                style={{ textTransform: "uppercase" }}
                              />
                            </Form.Item>
                            <Form.Item
                              className="col-span-2 md:col-span-1 justify-self-start md:justify-self-center"
                              name={[field.name, "age"]}
                              style={{ marginBottom: 0 }}
                              rules={[
                                {
                                  min: 12,
                                  max: 100,
                                  type: "number",
                                  message: `#${
                                    field.name + 1
                                  } Age must be 12 - 100 years old`,
                                },
                                {
                                  required: true,
                                  message: `#${field.name + 1} Age is required`,
                                },
                              ]}
                            >
                              <Select
                                className="onebits-booking-form"
                                style={{ width: 100 }}
                              >
                                {_.map(_.range(12, 100), (i) => {
                                  return (
                                    <Select.Option key={"adult" + i} value={i}>
                                      {i}
                                    </Select.Option>
                                  );
                                })}
                              </Select>
                            </Form.Item>
                            <Form.Item
                              className="col-span-2 md:col-span-1"
                              name={[field.name, "nationality"]}
                              style={{ marginBottom: 0 }}
                              rules={[
                                {
                                  required: true,
                                  message: `#${
                                    field.name + 1
                                  } nationality is required`,
                                },
                              ]}
                            >
                              <Input
                                placeholder={`#${field.name + 1} nationality`}
                                style={{ textTransform: "uppercase" }}
                              />
                            </Form.Item>
                            <div className="mb-4 col-span-6 grid grid-cols-2">
                              <Form.Item
                                className="col-span-1"
                                name={[field.name, "is_discounted"]}
                                style={{ marginBottom: 0 }}
                                valuePropName="checked"
                              >
                                <Checkbox
                                  disabled={
                                    (isSenior &&
                                      !(
                                        seniorData.type ===
                                          "adult_passengers" &&
                                        seniorData.index === field.name
                                      )) ||
                                    (totalPassengers.adult +
                                      totalPassengers.kid) %
                                      2 ===
                                      0
                                  }
                                  onChange={(e) =>
                                    handleIsDiscountedChange(
                                      "adult_passengers",
                                      field.name,
                                      e.target.checked
                                    )
                                  }
                                >
                                  PWD / Senior Citizen Discount?
                                </Checkbox>
                              </Form.Item>
                              <Form.Item
                                {...field}
                                className="col-span-1"
                                name={[field.name, "discount_id"]}
                                fieldKey={[field.fieldKey, "discount_id"]}
                                style={{ marginBottom: 0 }}
                                shouldUpdate={(prevValues, curValues) =>
                                  prevValues.adult_passengers[field.name]
                                    .is_discounted !==
                                  curValues.adult_passengers[field.name]
                                    .is_discounted
                                }
                                hidden={
                                  !passengers["adult_passengers"][field.name]
                                    .is_discounted
                                }
                                rules={[
                                  {
                                    required:
                                      passengers["adult_passengers"][field.name]
                                        .is_discounted,
                                    message: `#${
                                      field.name + 1
                                    } discount id is required`,
                                  },
                                ]}
                              >
                                <Input
                                  maxLength={13}
                                  style={{ padding: "3px 5px" }}
                                  placeholder={`#${
                                    field.name + 1
                                  } PWD / Senior Citizen ID`}
                                  disabled={
                                    !passengers["adult_passengers"][field.name]
                                      .is_discounted
                                  }
                                />
                              </Form.Item>
                            </div>
                          </div>
                        </React.Fragment>
                      ));
                    }}
                  </Form.List>

                  <ShowIf className="font-bold" cond={totalPassengers.kid > 0}>
                    <hr className="mb-2" />
                    Kid passengers
                  </ShowIf>
                  <Form.List name="kid_passengers">
                    {(fields, { add, remove }) => {
                      // addPax['adultPax'] = add; removePax['adultPax'] = remove;
                      return fields.map((field) => (
                        <React.Fragment key={field.key}>
                          <div className="grid grid-cols-6 gap-2">
                            <Form.Item
                              name={[field.name, "first_name"]}
                              className="col-span-3 md:col-span-2"
                              style={{ marginBottom: 0 }}
                              rules={[
                                {
                                  required: true,
                                  message: `#${
                                    field.name + 1
                                  } first name is required`,
                                },
                              ]}
                            >
                              <Input
                                placeholder={`#${field.name + 1} first name`}
                                style={{ textTransform: "uppercase" }}
                              />
                            </Form.Item>
                            <Form.Item
                              name={[field.name, "last_name"]}
                              className="col-span-3 md:col-span-2"
                              style={{ marginBottom: 0 }}
                              rules={[
                                {
                                  required: true,
                                  message: `#${
                                    field.name + 1
                                  } last name is required`,
                                },
                              ]}
                            >
                              <Input
                                placeholder={`#${field.name + 1} last name`}
                                style={{ textTransform: "uppercase" }}
                              />
                            </Form.Item>
                            <Form.Item
                              className="col-span-2 md:col-span-1 justify-self-start md:justify-self-center"
                              name={[field.name, "age"]}
                              style={{ marginBottom: 0 }}
                              rules={[
                                {
                                  min: 3,
                                  max: 11,
                                  type: "number",
                                  message: `#${
                                    field.name + 1
                                  } Age must be 3 - 11 years old`,
                                },
                                {
                                  required: true,
                                  message: `#${field.name + 1} Age is required`,
                                },
                              ]}
                            >
                              <Select
                                className="onebits-booking-form"
                                style={{ width: 100 }}
                              >
                                {_.map(_.range(3, 12), (i) => {
                                  return (
                                    <Select.Option key={"kid" + i} value={i}>
                                      {i}
                                    </Select.Option>
                                  );
                                })}
                              </Select>
                            </Form.Item>
                            <Form.Item
                              className="col-span-2 md:col-span-1"
                              name={[field.name, "nationality"]}
                              style={{ marginBottom: 0 }}
                              rules={[
                                {
                                  required: true,
                                  message: `#${
                                    field.name + 1
                                  } nationality is required`,
                                },
                              ]}
                            >
                              <Input
                                placeholder={`#${field.name + 1} nationality`}
                                style={{ textTransform: "uppercase" }}
                              />
                            </Form.Item>
                            <div className="mb-4 col-span-6 grid grid-cols-2">
                              <Form.Item
                                className="col-span-1"
                                name={[field.name, "is_discounted"]}
                                style={{ marginBottom: 0 }}
                                valuePropName="checked"
                              >
                                <Checkbox
                                  disabled={
                                    (isSenior &&
                                      !(
                                        seniorData.type === "kid_passengers" &&
                                        seniorData.index === field.name
                                      )) ||
                                    (totalPassengers.adult +
                                      totalPassengers.kid) %
                                      2 ===
                                      0
                                  }
                                  onChange={(e) =>
                                    handleIsDiscountedChange(
                                      "kid_passengers",
                                      field.name,
                                      e.target.checked
                                    )
                                  }
                                >
                                  PWD Discount?
                                </Checkbox>
                              </Form.Item>
                              <Form.Item
                                {...field}
                                className="col-span-1"
                                name={[field.name, "discount_id"]}
                                fieldKey={[field.fieldKey, "discount_id"]}
                                style={{ marginBottom: 0 }}
                                shouldUpdate={(prevValues, curValues) =>
                                  prevValues.kid_passengers[field.name]
                                    .is_discounted !==
                                  curValues.kid_passengers[field.name]
                                    .is_discounted
                                }
                                hidden={
                                  !passengers["kid_passengers"][field.name]
                                    .is_discounted
                                }
                                rules={[
                                  {
                                    required:
                                      passengers["kid_passengers"][field.name]
                                        .is_discounted,
                                    message: `#${
                                      field.name + 1
                                    } discount id is required`,
                                  },
                                ]}
                              >
                                <Input
                                  style={{ padding: "3px 5px" }}
                                  placeholder={`#${field.name + 1} PWD ID`}
                                  disabled={
                                    !passengers["kid_passengers"][field.name]
                                      .is_discounted
                                  }
                                />
                              </Form.Item>
                            </div>
                          </div>
                        </React.Fragment>
                      ));
                    }}
                  </Form.List>

                  <ShowIf
                    className="font-bold"
                    cond={totalPassengers.infant > 0}
                  >
                    <hr className="mb-2" />
                    Infant passengers
                  </ShowIf>
                  <Form.List name="infant_passengers">
                    {(fields, { add, remove }) => {
                      // addPax['adultPax'] = add; removePax['adultPax'] = remove;
                      return fields.map((field) => (
                        <React.Fragment key={field.key}>
                          <div className="grid grid-cols-6 gap-2">
                            <Form.Item
                              name={[field.name, "first_name"]}
                              className="col-span-3 md:col-span-2"
                              style={{ marginBottom: 0 }}
                              rules={[
                                {
                                  required: true,
                                  message: `#${
                                    field.name + 1
                                  } first name is required`,
                                },
                              ]}
                            >
                              <Input
                                placeholder={`#${field.name + 1} first name`}
                                style={{ textTransform: "uppercase" }}
                              />
                            </Form.Item>
                            <Form.Item
                              name={[field.name, "last_name"]}
                              className="col-span-3 md:col-span-2"
                              style={{ marginBottom: 0 }}
                              rules={[
                                {
                                  required: true,
                                  message: `#${
                                    field.name + 1
                                  } last name is required`,
                                },
                              ]}
                            >
                              <Input
                                placeholder={`#${field.name + 1} last name`}
                                style={{ textTransform: "uppercase" }}
                              />
                            </Form.Item>
                            <Form.Item
                              className="col-span-2 md:col-span-1 justify-self-start md:justify-self-center"
                              name={[field.name, "age"]}
                              style={{ marginBottom: 0 }}
                              rules={[
                                {
                                  min: 0,
                                  max: 2,
                                  type: "number",
                                  message: `#${
                                    field.name + 1
                                  } Age must be 0 - 2 years old`,
                                },
                                {
                                  required: true,
                                  message: `#${field.name + 1} Age is required`,
                                },
                              ]}
                            >
                              <Select
                                className="onebits-booking-form"
                                style={{ width: 100 }}
                              >
                                {_.map(_.range(0, 3), (i) => {
                                  return (
                                    <Select.Option key={"infant" + i} value={i}>
                                      {i}
                                    </Select.Option>
                                  );
                                })}
                              </Select>
                            </Form.Item>
                            <Form.Item
                              className="col-span-2 md:col-span-1"
                              name={[field.name, "nationality"]}
                              style={{ marginBottom: 0 }}
                              rules={[
                                {
                                  required: true,
                                  message: `#${
                                    field.name + 1
                                  } nationality is required`,
                                },
                              ]}
                            >
                              <Input
                                placeholder={`#${field.name + 1} nationality`}
                                style={{ textTransform: "uppercase" }}
                              />
                            </Form.Item>
                            {/** checkbox */}
                          </div>
                        </React.Fragment>
                      ));
                    }}
                  </Form.List>

                  {/* <h1 className="text-1xl tracking-tight font-bold text-gray-900 sm:text-2xl md:text-2xl mt-8">
                    <span className="block xl:inline">
                      Select online payment
                    </span>
                  </h1>
                
                  <Form.Item name="payment_option" rules={[{ required: false }]}>
                    <Radio.Group>
                      <Radio value={1} style={{ alignItems: "center" }}>
                        <div className="flex items-center">
                          <img src={CreditCardLogo} style={{ width: 90 }} />
                          <h3>Credit Card / Debit Card thru iPay88</h3>
                        </div>
                      </Radio>
                    </Radio.Group>
                  </Form.Item> */}
                </Form>
              </ShowIf>

              <ShowIf cond={step === 4}>
                <Card className="text-center">
                  Please Wait We are validating your data...
                  {/* Payment for booking in progress. Please complete payment to
                  confirm your trip. */}
                </Card>
              </ShowIf>
            </div>
            <StickyBox
              className="col-span-3 md:col-span-1"
              offsetTop={20}
              offsetBottom={20}
            >
              <div>
                <div>
                  <BookingSummary />
                  <Button
                    disabled={
                      selectedTrip.id === null ||
                      step === 4 ||
                      step === 2 ||
                      step === 1
                    }
                    type="primary"
                    block
                    size="large"
                    style={{ borderRadius: 7 }}
                    className="mt-2 justfy-self-center"
                    onClick={() => bookingForm.submit()}
                  >
                    RESERVED BOOKING
                  </Button>
                </div>
              </div>
            </StickyBox>
          </div>
        </div>
      </ShowIf>
      <ShowIf cond={step === 5}>
        <div className="p-5">
          <div className="flex flex-col items-center">
            {/* <ShowIf cond={status === "success"}> */}
              <div className="text-center">
                <h3 className="font-semibold">BOOKING RESERVED</h3>
                <p>Thank you for booking with Magic Leaf</p>
                <h2 className="font-semibold text-lg">
                  Booking reference no: {referenceNumber}
                </h2>
                <p>
                  Please check your email for the booking confirmation and
                  present it at the terminal with your valid goverment ID for
                  verification
                </p>
                <p>
                  For Inquires or clarification with regards to this booking
                  please email us at{" "}
                  <span className="text-green-500">info@magicleaf</span>
                </p>
              </div>
              Your booking was successful. Please check your email for trip
              details confirmation.
            {/* </ShowIf> */}
            <ShowIf cond={status === "failed"}>
              Your booking has failed. Contact our customer support for
              assistance.
            </ShowIf>
            <Button
              className="mt-8"
              type="success"
              style={{ borderRadius: 7 }}
              onClick={() => bookingAgain()}
            >
              Make another booking
            </Button>
          </div>
        </div>
      </ShowIf>
    </WebsiteLayout>
  );
}

export default Page;
