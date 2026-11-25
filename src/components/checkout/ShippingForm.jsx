function ShippingForm({ formData, onChange }) {
  const handleChange = (event) => {
    const { name, value } = event.target;
    onChange((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  return (
    <section className="checkout-card">
      <h2 className="checkout-section-title">Shipping Information</h2>

      <div className="checkout-form-grid">
        <div className="checkout-field checkout-field-full">
          <label htmlFor="fullName">Full Name</label>
          <input
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Enter your full name"
            required
          />
        </div>

        <div className="checkout-field">
          <label htmlFor="phone">Phone Number</label>
          <input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+201234567890"
            required
          />
        </div>

        <div className="checkout-field">
          <label htmlFor="country">Country</label>
          <input
            id="country"
            name="country"
            value={formData.country}
            onChange={handleChange}
            placeholder="Country"
            required
          />
        </div>

        <div className="checkout-field">
          <label htmlFor="city">City</label>
          <input
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="City"
            required
          />
        </div>

        <div className="checkout-field">
          <label htmlFor="postalCode">Postal Code</label>
          <input
            id="postalCode"
            name="postalCode"
            value={formData.postalCode}
            onChange={handleChange}
            placeholder="Postal code"
            required
          />
        </div>

        <div className="checkout-field checkout-field-full">
          <label htmlFor="address">Full Address</label>
          <textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Street, building, apartment..."
            rows={3}
            required
          />
        </div>

        <div className="checkout-field checkout-field-full">
          <label htmlFor="customerNote">Order Note (Optional)</label>
          <textarea
            id="customerNote"
            name="customerNote"
            value={formData.customerNote}
            onChange={handleChange}
            placeholder="Any special instructions?"
            rows={2}
          />
        </div>
      </div>
    </section>
  );
}

export default ShippingForm;