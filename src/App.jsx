import { useEffect, useState } from "react";
import "./App.css";

const API_URL =
  "https://apis2.ccbp.in/packers-and-movers/packers-and-movers-details";

function App() {
  const [moves, setMoves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    const getMoves = async () => {
      try {
        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const data = await response.json();

        console.log("API DATA:", data);

        setMoves(data.Customer_Estimate_Flow || []);
      } catch (err) {
        console.log(err);
        setError("Unable to load move details");
      } finally {
        setLoading(false);
      }
    };

    getMoves();
  }, []);

  // Find a value from different possible API property names
  const getValue = (obj, possibleKeys) => {
    if (!obj) return "-";

    for (const key of possibleKeys) {
      if (
        obj[key] !== undefined &&
        obj[key] !== null &&
        obj[key] !== ""
      ) {
        return obj[key];
      }
    }

    return "-";
  };

  const toggleDetails = (index) => {
    if (expandedId === index) {
      setExpandedId(null);
    } else {
      setExpandedId(index);
    }
  };

  if (loading) {
    return (
      <div className="status">
        <h2>Loading...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="status">
        <h2>{error}</h2>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="header">
        <h1>Packers and Movers</h1>
        <p>Move Details</p>
      </header>

      <main className="container">
        {moves.length === 0 ? (
          <div className="status">
            <h2>No move details found</h2>
          </div>
        ) : (
          moves.map((move, index) => {
            const isExpanded = expandedId === index;

            /*
              Different APIs sometimes use different names.
              We check multiple possible names.
            */

            const fromLocation = getValue(move, [
              "from_location",
              "fromLocation",
              "from",
              "source",
              "source_location",
              "origin",
              "pickup_location",
              "moving_from",
              "From",
            ]);

            const toLocation = getValue(move, [
              "to_location",
              "toLocation",
              "to",
              "destination",
              "destination_location",
              "drop_location",
              "moving_to",
              "To",
            ]);

            const distance = getValue(move, [
              "distance",
              "moving_distance",
              "total_distance",
              "Distance",
            ]);

            const duration = getValue(move, [
              "duration",
              "moving_duration",
              "total_duration",
              "estimated_duration",
              "travel_duration",
              "Duration",
            ]);

            const price = getValue(move, [
              "price",
              "cost",
              "amount",
              "total_price",
              "estimated_price",
              "moving_price",
              "Price",
            ]);

            // Get items from the API
            const items = move.items || [];

            return (
              <div className="move-card" key={index}>
                {/* TOP SECTION */}
                <div className="move-top">
                  <div className="location-section">
                    <div className="location-box">
                      <p className="location-label">FROM</p>
                      <h2>{fromLocation}</h2>
                    </div>

                    <div className="arrow">
                      →
                    </div>

                    <div className="location-box">
                      <p className="location-label">TO</p>
                      <h2>{toLocation}</h2>
                    </div>
                  </div>

                  {/* SUMMARY */}
                  <div className="summary">
                    <div className="summary-box">
                      <p>Distance</p>
                      <h3>{distance}</h3>
                    </div>

                    <div className="summary-box">
                      <p>Duration</p>
                      <h3>{duration}</h3>
                    </div>

                    <div className="summary-box">
                      <p>Price</p>
                      <h3>{price}</h3>
                    </div>
                  </div>
                </div>

                {/* MOVE NUMBER */}
                <div className="move-number">
                  Move {index + 1}
                </div>

                {/* BUTTON */}
                <button
                  type="button"
                  className="details-button"
                  onClick={() => toggleDetails(index)}
                >
                  {isExpanded
                    ? "Hide Move Details"
                    : "View Move Details"}
                </button>

                {/* DETAILS */}
                {isExpanded && (
                  <div className="details">
                    <h2>Move Details</h2>

                    {/* ITEMS */}
                    {Array.isArray(items) && items.length > 0 ? (
                      <div className="items-section">
                        <h3>Items</h3>

                        {items.map((item, itemIndex) => (
                          <div
                            className="item-card"
                            key={itemIndex}
                          >
                            {typeof item === "object" &&
                            item !== null ? (
                              Object.entries(item).map(
                                ([key, value]) => (
                                  <div
                                    className="detail-row"
                                    key={key}
                                  >
                                    <span className="detail-key">
                                      {key
                                        .replace(/_/g, " ")
                                        .replace(
                                          /\b\w/g,
                                          (letter) =>
                                            letter.toUpperCase()
                                        )}
                                    </span>

                                    <span className="detail-value">
                                      {typeof value === "object"
                                        ? JSON.stringify(
                                            value
                                          )
                                        : String(value)}
                                    </span>
                                  </div>
                                )
                              )
                            ) : (
                              <p>{String(item)}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="all-details">
                        <h3>Available Details</h3>

                        {Object.entries(move).map(
                          ([key, value]) => (
                            <div
                              className="detail-row"
                              key={key}
                            >
                              <span className="detail-key">
                                {key
                                  .replace(/_/g, " ")
                                  .replace(
                                    /\b\w/g,
                                    (letter) =>
                                      letter.toUpperCase()
                                  )}
                              </span>

                              <span className="detail-value">
                                {typeof value === "object"
                                  ? JSON.stringify(value)
                                  : String(value)}
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </main>
    </div>
  );
}

export default App;