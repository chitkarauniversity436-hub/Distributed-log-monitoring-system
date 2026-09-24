import { useCallback, useEffect, useMemo, useState } from "react";
import { getLogs } from "../services/logApi";
import { io } from "socket.io-client";

const Dashboard = () => {
    // =====================================================
    // STATE
    // =====================================================

    const [logs, setLogs] = useState([]);
    const [analytics, setAnalytics] = useState(null);

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");

    const [serviceFilter, setServiceFilter] = useState("all");
    const [levelFilter, setLevelFilter] = useState("all");
    const [search, setSearch] = useState("");

    // =====================================================
    // FETCH LOGS
    // =====================================================

    const loadLogs = useCallback(async () => {
        try {
            setError("");

            const data = await getLogs();

            setLogs(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to fetch logs:", error);
            alert(error.message);
        }
    }, []);

    // =====================================================
    // FETCH ANALYTICS
    // =====================================================

    const loadAnalytics = useCallback(async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                "http://localhost:3004/api/logs/analytics",
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to fetch analytics");
            }

            setAnalytics(data);
        } catch (error) {
            console.error("Failed to fetch analytics:", error);
        }
    }, []);

    // =====================================================
    // REFRESH DASHBOARD
    // =====================================================

    const refreshDashboard = async () => {
        try {
            setRefreshing(true);

            await Promise.all([
                loadLogs(),
                loadAnalytics()
            ]);
        } finally {
            setRefreshing(false);
        }
    };

    // =====================================================
    // INITIAL LOAD + SOCKET.IO
    // =====================================================

    useEffect(() => {
        const initializeDashboard = async () => {
            setLoading(true);

            await Promise.all([
                loadLogs(),
                loadAnalytics()
            ]);

            setLoading(false);
        };

        initializeDashboard();

        // Connect to Log Service
        const socket = io("http://localhost:3004");

        socket.on("connect", () => {
            console.log(
                "Connected to Log Service:",
                socket.id
            );
        });

        // Receive new logs in real time
        socket.on("new-log", (newLog) => {
            console.log(
                "New log received:",
                newLog
            );

            setLogs((currentLogs) => [
                newLog,
                ...currentLogs
            ]);

            // Update analytics
            loadAnalytics();
        });

        socket.on("disconnect", () => {
            console.log(
                "Disconnected from Log Service"
            );
        });

        return () => {
            socket.disconnect();
        };
    }, [loadLogs, loadAnalytics]);

    // =====================================================
    // LOCAL STATISTICS
    // =====================================================

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

    const successfulLogs = logs.filter(
        (log) =>
            log.statusCode >= 200 &&
            log.statusCode < 400
    ).length;

    const errorRate =
        analytics?.errorRate ??
        (
            totalLogs > 0
                ? (errorLogs / totalLogs) * 100
                : 0
        ).toFixed(2);

    const successRate =
        totalLogs > 0
            ? ((successfulLogs / totalLogs) * 100).toFixed(2)
            : 0;

    // =====================================================
    // UNIQUE SERVICES
    // =====================================================

    const services = useMemo(() => {
        return [
            ...new Set(
                logs
                    .map((log) => log.service)
                    .filter(Boolean)
            )
        ];
    }, [logs]);

    // =====================================================
    // FILTER LOGS
    // =====================================================

    const filteredLogs = useMemo(() => {
        const searchText = search.toLowerCase().trim();

        return logs.filter((log) => {
            const matchesService =
                serviceFilter === "all" ||
                log.service === serviceFilter;

            const matchesLevel =
                levelFilter === "all" ||
                log.level === levelFilter;

            const matchesSearch =
                !searchText ||
                log.message
                    ?.toLowerCase()
                    .includes(searchText) ||
                log.endpoint
                    ?.toLowerCase()
                    .includes(searchText) ||
                log.service
                    ?.toLowerCase()
                    .includes(searchText) ||
                log.method
                    ?.toLowerCase()
                    .includes(searchText);

            return (
                matchesService &&
                matchesLevel &&
                matchesSearch
            );
        });
    }, [
        logs,
        serviceFilter,
        levelFilter,
        search
    ]);

    // =====================================================
    // LEVEL STYLE
    // =====================================================

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

    // =====================================================
    // STATUS CODE STYLE
    // =====================================================

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

        if (
            statusCode >= 200 &&
            statusCode < 400
        ) {
            return {
                backgroundColor: "#dcfce7",
                color: "#15803d"
            };
        }

        return {
            backgroundColor: "#f1f5f9",
            color: "#475569"
        };
    };

    // =====================================================
    // HTTP METHOD STYLE
    // =====================================================

    const getMethodStyle = (method) => {
        const styles = {
            GET: {
                backgroundColor: "#dbeafe",
                color: "#1d4ed8"
            },

            POST: {
                backgroundColor: "#dcfce7",
                color: "#15803d"
            },

            PUT: {
                backgroundColor: "#fef3c7",
                color: "#b45309"
            },

            PATCH: {
                backgroundColor: "#f3e8ff",
                color: "#7e22ce"
            },

            DELETE: {
                backgroundColor: "#fee2e2",
                color: "#b91c1c"
            }
        };

        return (
            styles[method] || {
                backgroundColor: "#f1f5f9",
                color: "#475569"
            }
        );
    };

    // =====================================================
    // LOADING STATE
    // =====================================================

    if (loading) {
        return (
            <div
                style={{
                    minHeight: "100vh",
                    backgroundColor: "#f8fafc",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                }}
            >
                <div style={{ textAlign: "center" }}>
                    <h2>Loading Dashboard...</h2>

                    <p style={{ color: "#64748b" }}>
                        Fetching logs and analytics
                    </p>
                </div>
            </div>
        );
    }

    // =====================================================
    // DASHBOARD
    // =====================================================

    return (
        <div
            style={{
                minHeight: "100vh",
                backgroundColor: "#f8fafc",
                padding: "30px"
            }}
        >
            {/* HEADER */}

            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "30px",
                    gap: "20px",
                    flexWrap: "wrap"
                }}
            >
                <div>
                    <h1
                        style={{
                            margin: "0 0 6px",
                            fontSize: "30px",
                            color: "#0f172a"
                        }}
                    >
                        Log Monitoring Dashboard
                    </h1>

                    <p
                        style={{
                            margin: 0,
                            color: "#64748b"
                        }}
                    >
                        Monitor your microservices and
                        application logs in real time
                    </p>
                </div>

                <button
                    onClick={refreshDashboard}
                    disabled={refreshing}
                    style={{
                        border: "none",
                        backgroundColor: "#0f172a",
                        color: "white",
                        padding: "11px 18px",
                        borderRadius: "8px",
                        cursor: refreshing
                            ? "not-allowed"
                            : "pointer",
                        fontWeight: "600",
                        opacity: refreshing ? 0.7 : 1
                    }}
                >
                    {refreshing
                        ? "Refreshing..."
                        : "Refresh Dashboard"}
                </button>
            </div>

            {/* ERROR MESSAGE */}

            {error && (
                <div
                    style={{
                        backgroundColor: "#fee2e2",
                        color: "#991b1b",
                        padding: "14px 18px",
                        borderRadius: "8px",
                        marginBottom: "20px",
                        border: "1px solid #fecaca"
                    }}
                >
                    {error}
                </div>
            )}

            {/* STATISTICS */}

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns:
                        "repeat(auto-fit, minmax(180px, 1fr))",
                    gap: "18px",
                    marginBottom: "25px"
                }}
            >
                {/* TOTAL LOGS */}

                <div
                    style={{
                        backgroundColor: "white",
                        padding: "22px",
                        borderRadius: "12px",
                        border: "1px solid #e2e8f0"
                    }}
                >
                    <p
                        style={{
                            margin: 0,
                            color: "#64748b",
                            fontSize: "14px"
                        }}
                    >
                        Total Logs
                    </p>

                    <h2
                        style={{
                            margin: "10px 0 0",
                            fontSize: "30px"
                        }}
                    >
                        {analytics?.totalLogs ?? totalLogs}
                    </h2>
                </div>

                {/* INFO */}

                <div
                    style={{
                        backgroundColor: "white",
                        padding: "22px",
                        borderRadius: "12px",
                        border: "1px solid #e2e8f0"
                    }}
                >
                    <p
                        style={{
                            margin: 0,
                            color: "#64748b",
                            fontSize: "14px"
                        }}
                    >
                        INFO
                    </p>

                    <h2
                        style={{
                            margin: "10px 0 0",
                            fontSize: "30px",
                            color: "#15803d"
                        }}
                    >
                        {analytics?.infoLogs ?? infoLogs}
                    </h2>
                </div>

                {/* WARNINGS */}

                <div
                    style={{
                        backgroundColor: "white",
                        padding: "22px",
                        borderRadius: "12px",
                        border: "1px solid #e2e8f0"
                    }}
                >
                    <p
                        style={{
                            margin: 0,
                            color: "#64748b",
                            fontSize: "14px"
                        }}
                    >
                        WARNINGS
                    </p>

                    <h2
                        style={{
                            margin: "10px 0 0",
                            fontSize: "30px",
                            color: "#b45309"
                        }}
                    >
                        {analytics?.warningLogs ?? warnLogs}
                    </h2>
                </div>

                {/* ERRORS */}

                <div
                    style={{
                        backgroundColor: "white",
                        padding: "22px",
                        borderRadius: "12px",
                        border: "1px solid #e2e8f0"
                    }}
                >
                    <p
                        style={{
                            margin: 0,
                            color: "#64748b",
                            fontSize: "14px"
                        }}
                    >
                        ERRORS
                    </p>

                    <h2
                        style={{
                            margin: "10px 0 0",
                            fontSize: "30px",
                            color: "#b91c1c"
                        }}
                    >
                        {analytics?.errorLogs ?? errorLogs}
                    </h2>
                </div>

                {/* ERROR RATE */}

                <div
                    style={{
                        backgroundColor: "white",
                        padding: "22px",
                        borderRadius: "12px",
                        border: "1px solid #e2e8f0"
                    }}
                >
                    <p
                        style={{
                            margin: 0,
                            color: "#64748b",
                            fontSize: "14px"
                        }}
                    >
                        ERROR RATE
                    </p>

                    <h2
                        style={{
                            margin: "10px 0 0",
                            fontSize: "30px",
                            color: "#b91c1c"
                        }}
                    >
                        {errorRate}%
                    </h2>
                </div>

                {/* SUCCESS RATE */}

                <div
                    style={{
                        backgroundColor: "white",
                        padding: "22px",
                        borderRadius: "12px",
                        border: "1px solid #e2e8f0"
                    }}
                >
                    <p
                        style={{
                            margin: 0,
                            color: "#64748b",
                            fontSize: "14px"
                        }}
                    >
                        SUCCESS RATE
                    </p>

                    <h2
                        style={{
                            margin: "10px 0 0",
                            fontSize: "30px",
                            color: "#15803d"
                        }}
                    >
                        {successRate}%
                    </h2>
                </div>
            </div>

            {/* ERROR ANALYTICS */}

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns:
                        "repeat(auto-fit, minmax(320px, 1fr))",
                    gap: "20px",
                    marginBottom: "25px"
                }}
            >
                {/* ERRORS BY SERVICE */}

                <div
                    style={{
                        backgroundColor: "white",
                        padding: "22px",
                        borderRadius: "12px",
                        border: "1px solid #e2e8f0"
                    }}
                >
                    <h2
                        style={{
                            marginTop: 0,
                            marginBottom: "20px",
                            fontSize: "20px"
                        }}
                    >
                        Errors by Service
                    </h2>

                    {!analytics?.serviceErrors?.length ? (
                        <p style={{ color: "#64748b" }}>
                            No service errors found.
                        </p>
                    ) : (
                        analytics.serviceErrors.map(
                            (service) => {
                                const maxCount = Math.max(
                                    ...analytics.serviceErrors.map(
                                        (item) => item.count
                                    )
                                );

                                const percentage =
                                    maxCount > 0
                                        ? (service.count /
                                            maxCount) *
                                        100
                                        : 0;

                                return (
                                    <div
                                        key={service._id}
                                        style={{
                                            marginBottom: "18px"
                                        }}
                                    >
                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent:
                                                    "space-between",
                                                marginBottom: "7px"
                                            }}
                                        >
                                            <span
                                                style={{
                                                    fontWeight: "600"
                                                }}
                                            >
                                                {service._id}
                                            </span>

                                            <span
                                                style={{
                                                    color: "#b91c1c",
                                                    fontWeight: "700"
                                                }}
                                            >
                                                {service.count}
                                            </span>
                                        </div>

                                        <div
                                            style={{
                                                height: "8px",
                                                backgroundColor:
                                                    "#f1f5f9",
                                                borderRadius: "10px",
                                                overflow: "hidden"
                                            }}
                                        >
                                            <div
                                                style={{
                                                    width: `${percentage}%`,
                                                    height: "100%",
                                                    backgroundColor:
                                                        "#ef4444",
                                                    borderRadius: "10px"
                                                }}
                                            />
                                        </div>
                                    </div>
                                );
                            }
                        )
                    )}
                </div>

                {/* ERRORS BY STATUS CODE */}

                <div
                    style={{
                        backgroundColor: "white",
                        padding: "22px",
                        borderRadius: "12px",
                        border: "1px solid #e2e8f0"
                    }}
                >
                    <h2
                        style={{
                            marginTop: 0,
                            marginBottom: "20px",
                            fontSize: "20px"
                        }}
                    >
                        Errors by Status Code
                    </h2>

                    {!analytics?.statusCodeErrors?.length ? (
                        <p style={{ color: "#64748b" }}>
                            No error status codes found.
                        </p>
                    ) : (
                        analytics.statusCodeErrors.map(
                            (status) => (
                                <div
                                    key={status._id}
                                    style={{
                                        display: "flex",
                                        justifyContent:
                                            "space-between",
                                        alignItems: "center",
                                        padding: "12px 0",
                                        borderBottom:
                                            "1px solid #f1f5f9"
                                    }}
                                >
                                    <span
                                        style={{
                                            ...getStatusStyle(
                                                Number(status._id)
                                            ),
                                            padding: "6px 10px",
                                            borderRadius: "6px",
                                            fontWeight: "700"
                                        }}
                                    >
                                        {status._id}
                                    </span>

                                    <span
                                        style={{
                                            fontWeight: "600"
                                        }}
                                    >
                                        {status.count} errors
                                    </span>
                                </div>
                            )
                        )
                    )}
                </div>
            </div>

            {/* FILTERS */}

            <div
                style={{
                    backgroundColor: "white",
                    padding: "20px",
                    borderRadius: "12px",
                    border: "1px solid #e2e8f0",
                    marginBottom: "20px"
                }}
            >
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(auto-fit, minmax(180px, 1fr))",
                        gap: "12px"
                    }}
                >
                    {/* SERVICE FILTER */}

                    <select
                        value={serviceFilter}
                        onChange={(e) =>
                            setServiceFilter(e.target.value)
                        }
                        style={{
                            padding: "11px",
                            borderRadius: "7px",
                            border: "1px solid #cbd5e1",
                            backgroundColor: "white"
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

                    {/* LEVEL FILTER */}

                    <select
                        value={levelFilter}
                        onChange={(e) =>
                            setLevelFilter(e.target.value)
                        }
                        style={{
                            padding: "11px",
                            borderRadius: "7px",
                            border: "1px solid #cbd5e1",
                            backgroundColor: "white"
                        }}
                    >
                        <option value="all">
                            All Levels
                        </option>

                        <option value="info">
                            INFO
                        </option>

                        <option value="warn">
                            WARN
                        </option>

                        <option value="error">
                            ERROR
                        </option>
                    </select>

                    {/* SEARCH */}

                    <input
                        type="text"
                        placeholder="Search logs..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                        style={{
                            padding: "11px",
                            borderRadius: "7px",
                            border: "1px solid #cbd5e1",
                            outline: "none",
                            minWidth: 0
                        }}
                    />

                    {/* CLEAR FILTERS */}

                    <button
                        onClick={() => {
                            setServiceFilter("all");
                            setLevelFilter("all");
                            setSearch("");
                        }}
                        style={{
                            padding: "11px",
                            borderRadius: "7px",
                            border: "1px solid #cbd5e1",
                            backgroundColor: "#f8fafc",
                            cursor: "pointer",
                            fontWeight: "600"
                        }}
                    >
                        Clear Filters
                    </button>
                </div>
            </div>

            {/* LOG HEADER */}

            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "15px",
                    flexWrap: "wrap",
                    gap: "10px"
                }}
            >
                <div>
                    <h2
                        style={{
                            margin: 0,
                            color: "#0f172a"
                        }}
                    >
                        Recent Logs
                    </h2>

                    <p
                        style={{
                            margin: "5px 0 0",
                            color: "#64748b"
                        }}
                    >
                        Showing {filteredLogs.length} of{" "}
                        {logs.length} logs
                    </p>
                </div>

                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        color: "#15803d",
                        fontSize: "14px",
                        fontWeight: "600"
                    }}
                >
                    <span
                        style={{
                            width: "9px",
                            height: "9px",
                            borderRadius: "50%",
                            backgroundColor: "#22c55e",
                            display: "inline-block"
                        }}
                    />

                    Real-time monitoring
                </div>
            </div>

            {/* LOG LIST */}

            <div
                style={{
                    backgroundColor: "white",
                    borderRadius: "12px",
                    border: "1px solid #e2e8f0",
                    padding: "20px"
                }}
            >
                {filteredLogs.length === 0 ? (
                    <div
                        style={{
                            textAlign: "center",
                            padding: "50px 20px",
                            color: "#64748b"
                        }}
                    >
                        <h3
                            style={{
                                marginBottom: "8px",
                                color: "#334155"
                            }}
                        >
                            No logs found
                        </h3>

                        <p style={{ margin: 0 }}>
                            Try changing your filters or
                            search term.
                        </p>
                    </div>
                ) : (
                    filteredLogs.map((log) => (
                        <div
                            key={log._id}
                            style={{
                                padding: "18px 0",
                                borderBottom:
                                    "1px solid #e2e8f0"
                            }}
                        >
                            {/* TOP ROW */}

                            <div
                                style={{
                                    display: "flex",
                                    justifyContent:
                                        "space-between",
                                    alignItems: "center",
                                    gap: "15px",
                                    flexWrap: "wrap"
                                }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "8px",
                                        flexWrap: "wrap"
                                    }}
                                >
                                    <strong
                                        style={{
                                            color: "#0f172a"
                                        }}
                                    >
                                        {log.service}
                                    </strong>

                                    <span
                                        style={{
                                            ...getLevelStyle(
                                                log.level
                                            ),
                                            padding: "4px 8px",
                                            borderRadius: "5px",
                                            fontSize: "11px",
                                            fontWeight: "700"
                                        }}
                                    >
                                        {log.level?.toUpperCase()}
                                    </span>
                                </div>

                                <small
                                    style={{
                                        color: "#64748b"
                                    }}
                                >
                                    {log.createdAt
                                        ? new Date(
                                            log.createdAt
                                        ).toLocaleString()
                                        : "Unknown time"}
                                </small>
                            </div>

                            {/* MESSAGE */}

                            <p
                                style={{
                                    margin: "12px 0",
                                    color: "#334155",
                                    lineHeight: "1.5"
                                }}
                            >
                                {log.message}
                            </p>

                            {/* REQUEST INFORMATION */}

                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "10px",
                                    flexWrap: "wrap"
                                }}
                            >
                                {log.method && (
                                    <span
                                        style={{
                                            ...getMethodStyle(
                                                log.method
                                            ),
                                            padding: "5px 8px",
                                            borderRadius: "5px",
                                            fontSize: "11px",
                                            fontWeight: "700"
                                        }}
                                    >
                                        {log.method}
                                    </span>
                                )}

                                {log.endpoint && (
                                    <span
                                        style={{
                                            backgroundColor:
                                                "#f8fafc",
                                            padding: "5px 9px",
                                            borderRadius: "5px",
                                            color: "#475569",
                                            fontSize: "13px",
                                            border:
                                                "1px solid #e2e8f0",
                                            wordBreak: "break-all"
                                        }}
                                    >
                                        {log.endpoint}
                                    </span>
                                )}

                                {log.statusCode && (
                                    <span
                                        style={{
                                            ...getStatusStyle(
                                                log.statusCode
                                            ),
                                            padding: "5px 9px",
                                            borderRadius: "5px",
                                            fontSize: "11px",
                                            fontWeight: "700"
                                        }}
                                    >
                                        {log.statusCode}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Dashboard;