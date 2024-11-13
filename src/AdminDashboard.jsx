import React, { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import { CSVLink } from 'react-csv';
import { Chart } from 'react-google-charts';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from 'react-modal';
import { FaTrashAlt, FaFileExport, FaUser, FaDonate, FaSearch, FaChartLine } from 'react-icons/fa';
import axios from 'axios'; // Import axios for making HTTP requests

Modal.setAppElement('#root');

const AdminDashboard = () => {
    const [registrations, setRegistrations] = useState([]);
    const [donations, setDonations] = useState([]);
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalDonations, setTotalDonations] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);
    const [filteredRegistrations, setFilteredRegistrations] = useState([]);
    const [filteredDonations, setFilteredDonations] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedDonation, setSelectedDonation] = useState(null);

    useEffect(() => {
        const db = getFirestore();

        const unsubscribeUsers = onSnapshot(collection(db, 'users'), snapshot => {
            const usersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setRegistrations(usersData);
            setFilteredRegistrations(usersData);
            setTotalUsers(usersData.length);
        });

        const unsubscribeDonations = onSnapshot(collection(db, 'donations'), snapshot => {
            const donationsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setDonations(donationsData);
            setFilteredDonations(donationsData);
            setTotalDonations(donationsData.length);

            const donationSum = donationsData.reduce((sum, donation) => sum + donation.amount, 0);
            setTotalAmount(donationSum);

            donationsData.forEach(donation => {
                toast.info(`💸 New donation received: ${donation.donorName} donated $${donation.amount}`);
            });
        });

        // Cleanup listeners on unmount
        return () => {
            unsubscribeUsers();
            unsubscribeDonations();
        };
    }, []);

    const handleSearch = (event) => {
        const query = event.target.value.toLowerCase().trim();

        const filteredUsers = registrations.filter(user =>
            user.name.toLowerCase().includes(query) || user.email.toLowerCase().includes(query)
        );

        const filteredDonationList = donations.filter(donation =>
            donation.donorName.toLowerCase().includes(query)
        );

        setFilteredRegistrations(filteredUsers);
        setFilteredDonations(filteredDonationList);
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            const db = getFirestore();
            await deleteDoc(doc(db, 'users', userId));
            setRegistrations(prev => prev.filter(user => user.id !== userId));
            setFilteredRegistrations(prev => prev.filter(user => user.id !== userId));
            setTotalUsers(prev => prev - 1);
            toast.success('User successfully deleted.');
        }
    };

    const handleDeleteDonation = async (donationId) => {
        if (window.confirm("Are you sure you want to delete this donation?")) {
            const db = getFirestore();
            await deleteDoc(doc(db, 'donations', donationId));
            const deletedDonation = donations.find(donation => donation.id === donationId);
            setDonations(prev => prev.filter(donation => donation.id !== donationId));
            setFilteredDonations(prev => prev.filter(donation => donation.id !== donationId));
            setTotalDonations(prev => prev - 1);
            setTotalAmount(prev => prev - deletedDonation.amount);
            toast.success('Donation successfully deleted.');
        }
    };

    const handleUserClick = (user) => {
        setSelectedUser(user);
    };

    const handleDonationClick = (donation) => {
        setSelectedDonation(donation);
    };

    const handleSendInformation = async () => {
        try {
            console.log("Sending SMS request...");
            const response = await axios.post('http://localhost:5000/send-sms');
            console.log("Response received:", response.data);
            
            if (response.data.status === 'success') {
                toast.success('SMS sent successfully!');
            } else {
                toast.error('Error sending SMS: ' + response.data.message);
            }
        } catch (error) {
            console.error("Error details:", error);
            if (error.response) {
                toast.error(`Error: ${error.response.status} - ${error.response.data.message}`);
            } else if (error.request) {
                toast.error('No response received from the server. Please check if it is running.');
            } else {
                toast.error('Error sending SMS: ' + error.message);
            }
        }
    };

    const chartData = [
        ['Month', 'Donations'],
        ...donations.map(donation => {
            const date = new Date(donation.date);
            const month = date.toLocaleString('default', { month: 'long' });
            return [isNaN(date.getTime()) ? 'Invalid Date' : month, donation.amount];
        })
    ];

    return (
        <div style={styles.dashboardContainer}>
            <ToastContainer />
            <header style={styles.dashboardHeader}>
                <h1 style={styles.dashboardTitle}>Admin Dashboard</h1>
                <div style={styles.headerStats}>
                    <div style={styles.headerStatItem}>
                        <FaUser style={styles.headerStatIcon} />
                        <span>{totalUsers} Alumni </span>
                    </div>
                    <div style={styles.headerStatItem}>
                        <FaDonate style={styles.headerStatIcon} />
                        <span>{totalDonations} Donations</span>
                    </div>
                    <div style={styles.headerStatItem}>
                        <FaChartLine style={styles.headerStatIcon} />
                        <span>${totalAmount} Total Amount</span>
                    </div>
                </div>
            </header>

            <main style={styles.mainContent}>
                <section style={styles.searchSection}>
                    <div style={styles.searchContainer}>
                        <FaSearch style={styles.searchIcon} />
                        <input
                            type="text"
                            style={styles.searchInput}
                            placeholder="Search Alumni or donations..."
                            onChange={handleSearch}
                        />
                    </div>
                </section>

                <section style={styles.tableSection}>
                    <h2 style={styles.sectionTitle}>Recent Alumni Registrations</h2>
                    <table style={styles.dataTable}>
                        <thead>
                            <tr style={styles.dataTableRow}>
                                <th style={styles.dataTableHeader}>Name</th>
                                <th style={styles.dataTableHeader}>Email ID</th>
                                <th style={styles.dataTableHeader}>Registered At</th>
                                <th style={styles.dataTableHeader}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRegistrations.map((user, index) => (
                                <tr key={index} style={index % 2 === 0 ? styles.dataTableRow : styles.dataTableAltRow}>
                                    <td style={styles.dataTableCell} onClick={() => handleUserClick(user)}>{user.name}</td>
                                    <td style={styles.dataTableCell}>{user.email}</td>
                                    <td style={styles.dataTableCell}>{new Date(user.registeredAt).toLocaleDateString()}</td>
                                    <td style={styles.dataTableCell}>
                                        <button style={styles.deleteButton} onClick={() => handleDeleteUser(user.id)}>
                                            <FaTrashAlt />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <CSVLink style={styles.exportButton} data={registrations} filename={"user_registrations.csv"}>
                        <FaFileExport /> Export Alumni Registrations
                    </CSVLink>
                </section>

                <section style={styles.donationsSection}>
                    <h2 style={styles.sectionTitle}>Recent Donations contributed by the Alumni</h2>
                    <ul style={styles.donationsList}>
                        {filteredDonations.map((donation, index) => (
                            <li key={index} style={styles.donationItem} onClick={() => handleDonationClick(donation)}>
                                {donation.donorName} donated ${donation.amount} on {new Date(donation.date).toLocaleDateString()}
                                <button style={styles.deleteButton} onClick={() => handleDeleteDonation(donation.id)}>
                                    <FaTrashAlt />
                                </button>
                            </li>
                        ))}
                    </ul>
                    <CSVLink style={styles.exportButton} data={donations} filename={"donations.csv"}>
                        <FaFileExport /> Export Donations
                    </CSVLink>
                </section>

                <section style={styles.chartSection}>
                    <h2 style={styles.sectionTitle}>Donations Trend</h2>
                    <Chart
                        width={'100%'}
                        height={'400px'}
                        chartType="LineChart"
                        loader={<div>Loading Chart...</div>}
                        data={chartData}
                        options={{
                            title: 'Donations Over Time',
                            hAxis: {
                                title: 'Month',
                                textStyle: { color: '#4CAF50' },
                            },
                            vAxis: {
                                title: 'Amount',
                                textStyle: { color: '#4CAF50' },
                            },
                            legend: 'none',
                        }}
                    />
                </section>

                <button style={styles.sendButton} onClick={handleSendInformation}>
                    Send Information
                </button>
            </main>
        </div>
    );
};

// Add styles for the dashboard
const styles = {
    dashboardContainer: {
        padding: '20px',
        backgroundColor: '#f4f4f4',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    },
    dashboardHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
    },
    dashboardTitle: {
        fontSize: '24px',
        fontWeight: 'bold',
    },
    headerStats: {
        display: 'flex',
        gap: '20px',
    },
    headerStatItem: {
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: '10px',
        borderRadius: '5px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    },
    headerStatIcon: {
        marginRight: '5px',
    },
    mainContent: {
        marginTop: '20px',
    },
    searchSection: {
        marginBottom: '20px',
    },
    searchContainer: {
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: '10px',
        borderRadius: '5px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    },
    searchIcon: {
        marginRight: '10px',
    },
    searchInput: {
        border: 'none',
        outline: 'none',
        width: '100%',
    },
    tableSection: {
        marginBottom: '20px',
    },
    dataTable: {
        width: '100%',
        borderCollapse: 'collapse',
    },
    dataTableRow: {
        backgroundColor: '#fff',
    },
    dataTableAltRow: {
        backgroundColor: '#f9f9f9',
    },
    dataTableHeader: {
        padding: '10px',
        backgroundColor: '#2980b9',
        color: '#fff',
    },
    dataTableCell: {
        padding: '10px',
        border: '1px solid #ddd',
    },
    deleteButton: {
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        color: '#e74c3c',
    },
    exportButton: {
        display: 'inline-block',
        marginTop: '10px',
        padding: '10px',
        backgroundColor: '#27ae60',
        color: '#fff',
        borderRadius: '5px',
        textDecoration: 'none',
    },
    donationsSection: {
        marginBottom: '20px',
    },
    donationsList: {
        listStyleType: 'none',
        padding: '0',
    },
    donationItem: {
        backgroundColor: '#fff',
        padding: '10px',
        margin: '5px 0',
        borderRadius: '5px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    chartSection: {
        marginBottom: '20px',
    },
    sectionTitle: {
        fontSize: '20px',
        marginBottom: '10px',
        fontWeight: 'bold',
    },
    sendButton: {
        backgroundColor: '#2980b9',
        color: '#fff',
        padding: '12px 20px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontWeight: '600',
        transition: 'background-color 0.3s ease',
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
    },
};

export default AdminDashboard;
