import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from './firebase'; // Import your Firestore instance

const OrganizationRegistration = () => {
    const [formData, setFormData] = useState({
        organizationName: '',
        contactPerson: '',
        email: '',
        password: '',
        confirmPassword: '',
        address: '',
        phoneNumber: '',
        website: '',
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const validateForm = () => {
        let formErrors = {};

        if (!/\S+@\S+\.\S+/.test(formData.email)) {
            formErrors.email = 'Invalid email format';
        }

        if (formData.password.length < 6) {
            formErrors.password = 'Password must be at least 6 characters long';
        }

        if (formData.password !== formData.confirmPassword) {
            formErrors.confirmPassword = 'Passwords do not match!';
        }

        if (!/^\d{10}$/.test(formData.phoneNumber)) {
            formErrors.phoneNumber = 'Please enter a valid 10-digit phone number';
        }

        if (formData.website && !/^https?:\/\/[^\s$.?#].[^\s]*$/.test(formData.website)) {
            formErrors.website = 'Please enter a valid website URL';
        }

        return formErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const formErrors = validateForm();

        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            setLoading(false);
            return;
        }

        try {
            await addDoc(collection(db, 'organizations'), formData);
            alert('Registration successful!');
        } catch (error) {
            console.error('Error adding document: ', error);
            alert('Failed to register organization');
        } finally {
            setLoading(false);
            setFormData({
                organizationName: '',
                contactPerson: '',
                email: '',
                password: '',
                confirmPassword: '',
                address: '',
                phoneNumber: '',
                website: '',
            });
            setErrors({});
        }
    };

    return (
        <div style={styles.pageContainer}>
            <div style={styles.container}>
                <h1 style={styles.header}>Organization Registration</h1>
                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Organization Name</label>
                        <input 
                            type="text" 
                            name="organizationName" 
                            value={formData.organizationName}
                            onChange={handleChange}
                            required 
                            style={styles.input} 
                        />
                    </div>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Contact Person</label>
                        <input 
                            type="text" 
                            name="contactPerson" 
                            value={formData.contactPerson}
                            onChange={handleChange}
                            required 
                            style={styles.input} 
                        />
                    </div>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Email</label>
                        <input 
                            type="email" 
                            name="email" 
                            value={formData.email}
                            onChange={handleChange}
                            required 
                            style={styles.input} 
                        />
                        {errors.email && <p style={styles.errorText}>{errors.email}</p>}
                    </div>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Password</label>
                        <input 
                            type="password" 
                            name="password" 
                            value={formData.password} 
                            onChange={handleChange} 
                            required 
                            style={styles.input} 
                        />
                        {errors.password && <p style={styles.errorText}>{errors.password}</p>}
                    </div>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Confirm Password</label>
                        <input 
                            type="password" 
                            name="confirmPassword" 
                            value={formData.confirmPassword} 
                            onChange={handleChange} 
                            required 
                            style={styles.input} 
                        />
                        {errors.confirmPassword && <p style={styles.errorText}>{errors.confirmPassword}</p>}
                    </div>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Phone Number</label>
                        <input 
                            type="text" 
                            name="phoneNumber" 
                            value={formData.phoneNumber} 
                            onChange={handleChange} 
                            required 
                            style={styles.input} 
                        />
                        {errors.phoneNumber && <p style={styles.errorText}>{errors.phoneNumber}</p>}
                    </div>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Website</label>
                        <input 
                            type="url" 
                            name="website" 
                            value={formData.website} 
                            onChange={handleChange} 
                            style={styles.input} 
                        />
                        {errors.website && <p style={styles.errorText}>{errors.website}</p>}
                    </div>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Address</label>
                        <input 
                            type="text" 
                            name="address" 
                            value={formData.address} 
                            onChange={handleChange}
                            required 
                            style={styles.input} 
                        />
                    </div>
                    <button 
                        type="submit" 
                        disabled={loading}
                        style={{ ...styles.button, cursor: loading ? 'not-allowed' : 'pointer' }}
                    >
                        {loading ? 'Registering...' : 'Register'}
                    </button>
                </form>
            </div>
        </div>
    );
};

const styles = {
    pageContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(120deg, #f6d365 0%, #fda085 100%)',
    },
    container: {
        maxWidth: '600px',
        width: '100%',
        margin: '20px',
        padding: '30px',
        backgroundColor: '#ffffff',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
    header: {
        textAlign: 'center',
        marginBottom: '20px',
        fontFamily: "'Roboto', sans-serif",
        color: '#34495e',
    },
    form: {
        display: 'grid',
        gap: '15px',
    },
    formGroup: {
        display: 'flex',
        flexDirection: 'column',
    },
    label: {
        marginBottom: '5px',
        fontFamily: "'Roboto', sans-serif",
        fontWeight: 'bold',
        color: '#2c3e50',
    },
    input: {
        padding: '10px',
        border: '1px solid #dcdcdc',
        borderRadius: '5px',
        fontSize: '16px',
        fontFamily: "'Roboto', sans-serif",
        transition: 'border-color 0.3s ease-in-out',
    },
    errorText: {
        marginTop: '5px',
        color: '#e74c3c',
        fontSize: '14px',
    },
    button: {
        padding: '10px 20px',
        backgroundColor: '#3498db',
        color: '#ffffff',
        border: 'none',
        borderRadius: '5px',
        fontSize: '16px',
        fontFamily: "'Roboto', sans-serif",
        transition: 'background-color 0.3s ease-in-out',
    },
};

export default OrganizationRegistration;