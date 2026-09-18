import { useEffect, useState } from "react";
import { getLogs } from "../services/logApi";
import { io } from "socket.io-client";

const Dashboard = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [serviceFilter, setServiceFilter] = useState("all");
    const [levelFilter, setLevelFilter] = useState("all");
    const [search, setSearch] = useState("");

    useEffect(() => {
  const loadLogs = async () => {
    try {
      const data = await getLogs();
      setLogs(data);
    } catch (error) {
      console.error(error);
      setError("Failed to fetch logs");
    } finally {
      setLoading(false);
    }
  };

  loadLogs();

  const socket = io("http://localhost:3004");

  socket.on("new-log", (newLog) => {
    console.log("New log received:", newLog);

    setLogs((currentLogs) => [
      newLog,
      ...currentLogs
    ]);
  });

  return () => {
    socket.disconnect();
  };
}, []);

    // Statistics
    const totalLogs = logs.length;

    const infoLogs = logs.filter(
        (log) => log.level === "info"
    ).length;

    const warnLogs = logs.filter(
        (log) => log.level === "warn"
    ).length;

    const errorLogs = logs.filter(
        (log) => log.level === "error"
    ).length;

    // Unique services
    const services = [
        ...new Set(logs.map((log) => log.service))
    ];

    // Filters
    const filteredLogs = logs.filter((log) => {
        const matchesService =
            serviceFilter === "all" ||
            log.service === serviceFilter;

        const matchesLevel =
            levelFilter === "all" ||
            log.level === levelFilter;

        const searchText = search.toLowerCase();

        const matchesSearch =
            log.message?.toLowerCase().includes(searchText) ||
            log.endpoint?.toLowerCase().includes(searchText) ||
            log.service?.toLowerCase().includes(searchText);

        return (
            matchesService &&
            matchesLevel &&
            matchesSearch
        );
    });

    // Log level badge
    const getLevelStyle = (level) => {
        if (level === "error") {
            return {
                backgroundColor: "#fee2e2",
                color: "#b91c1c"
            };
        }

        if (level === "warn") {
            return {
                backgroundColor: "#fef3c7",
                color: "#b45309"
            };
        }

        return {
            backgroundColor: "#dcfce7",
            color: "#15803d"
        };
    };

    // Status code badge
    const getStatusStyle = (statusCode) => {
        if (statusCode >= 500) {
            return {
                backgroundColor: "#fee2e2",
                color: "#b91c1c"
            };
        }

        if (statusCode >= 400) {
            return {
                backgroundColor: "#fef3c7",
                color: "#b45309"
            };
        }

        return {
            backgroundColor: "#dcfce7",
            color: "#15803d"
        };
    };

    if (loading) {
        return (
            <div style={{ padding: "30px" }}>
                <h2>Loading logs...</h2>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ padding: "30px" }}>
                <h2>{error}</h2>
            </div>
        );
    }

    return (
        <div
            style={{
                padding: "30px",
                backgroundColor: "#f8fafc",
                minHeight: "100vh"
            }}
        >
            {/* Header */}
            <div style={{ marginBottom: "30px" }}>
                <h1 style={{ marginBottom: "5px" }}>
                    Log Monitoring Dashboard
                </h1>

                <p style={{ color: "#64748b" }}>
                    Monitor your microservices and application logs
                </p>
            </div>

            {/* Statistics Cards */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns:
                        "repeat(4, minmax(0, 1fr))",
                    gap: "20px",
                    marginBottom: "30px"
                }}
            >
                <div
                    style={{
                        backgroundColor: "white",
                        padding: "20px",
                        borderRadius: "10px",
                        border: "1px solid #e2e8f0"
                    }}
                >
                    <p style={{ color: "#64748b" }}>
                        Total Logs
                    </p>

                    <h2>{totalLogs}</h2>
                </div>

                <div
                    style={{
                        backgroundColor: "white",
                        padding: "20px",
                        borderRadius: "10px",
                        border: "1px solid #e2e8f0"
                    }}
                >
                    <p style={{ color: "#64748b" }}>
                        INFO
                    </p>

                    <h2>{infoLogs}</h2>
                </div>

                <div
                    style={{
                        backgroundColor: "white",
                        padding: "20px",
                        borderRadius: "10px",
                        border: "1px solid #e2e8f0"
                    }}
                >
                    <p style={{ color: "#64748b" }}>
                        WARN
                    </p>

                    <h2>{warnLogs}</h2>
                </div>

                <div
                    style={{
                        backgroundColor: "white",
                        padding: "20px",
                        borderRadius: "10px",
                        border: "1px solid #e2e8f0"
                    }}
                >
                    <p style={{ color: "#64748b" }}>
                        ERROR
                    </p>

                    <h2>{errorLogs}</h2>
                </div>
            </div>

            {/* Filters */}
            <div
                style={{
                    backgroundColor: "white",
                    padding: "20px",
                    borderRadius: "10px",
                    border: "1px solid #e2e8f0",
                    marginBottom: "20px",
                    display: "flex",
                    gap: "15px"
                }}
            >
                <select
                    value={serviceFilter}
                    onChange={(e) =>
                        setServiceFilter(e.target.value)
                    }
                    style={{
                        padding: "10px",
                        borderRadius: "6px",
                        border: "1px solid #cbd5e1"
                    }}
                >
                    <option value="all">
                        All Services
                    </option>

                    {services.map((service) => (
                        <option
                            key={service}
                            value={service}
                        >
                            {service}
                        </option>
                    ))}
                </select>

                <select
                    value={levelFilter}
                    onChange={(e) =>
                        setLevelFilter(e.target.value)
                    }
                    style={{
                        padding: "10px",
                        borderRadius: "6px",
                        border: "1px solid #cbd5e1"
                    }}
                >
                    <option value="all">
                        All Levels
                    </option>

                    <option value="info">INFO</option>
                    <option value="warn">WARN</option>
                    <option value="error">ERROR</option>
                </select>

                <input
                    type="text"
                    placeholder="Search logs..."
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                    style={{
                        padding: "10px",
                        borderRadius: "6px",
                        border: "1px solid #cbd5e1",
                        flex: 1
                    }}
                />
            </div>

            {/* Logs */}
            <div
                style={{
                    backgroundColor: "white",
                    borderRadius: "10px",
                    border: "1px solid #e2e8f0",
                    padding: "20px"
                }}
            >
                <h2 style={{ marginBottom: "20px" }}>
                    Recent Logs ({filteredLogs.length})
                </h2>

                {filteredLogs.length === 0 ? (
                    <p>No matching logs found.</p>
                ) : (
                    filteredLogs.map((log) => (
                        <div
                            key={log._id}
                            style={{
                                borderBottom:
                                    "1px solid #e2e8f0",
                                padding: "15px 0"
                            }}
                        >
                            {/* Top row */}
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent:
                                        "space-between",
                                    alignItems: "center"
                                }}
                            >
                                <div>
                                    <strong>
                                        {log.service}
                                    </strong>

                                    <span
                                        style={{
                                            ...getLevelStyle(
                                                log.level
                                            ),
                                            padding:
                                                "4px 8px",
                                            borderRadius: "5px",
                                            fontSize: "12px",
                                            fontWeight: "bold",
                                            marginLeft: "10px"
                                        }}
                                    >
                                        {log.level.toUpperCase()}
                                    </span>
                                </div>

                                <small
                                    style={{
                                        color: "#64748b"
                                    }}
                                >
                                    {new Date(
                                        log.createdAt
                                    ).toLocaleString()}
                                </small>
                            </div>

                            {/* Message */}
                            <p
                                style={{
                                    margin: "10px 0"
                                }}
                            >
                                {log.message}
                            </p>

                            {/* Request information */}
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "10px"
                                }}
                            >
                                <span>
                                    {log.method}
                                </span>

                                <span>
                                    {log.endpoint}
                                </span>

                                <span
                                    style={{
                                        ...getStatusStyle(
                                            log.statusCode
                                        ),
                                        padding: "4px 8px",
                                        borderRadius: "5px",
                                        fontSize: "12px",
                                        fontWeight: "bold"
                                    }}
                                >
                                    {log.statusCode}
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Dashboard;