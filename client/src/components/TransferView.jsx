import { useState, useEffect, useRef } from "react";
import axios from "axios";
import './TransferView.css'

export default function TransferView({ onCloseTransfer, handleTransaction, data, error, success, selectedAccount }) {
  const modalBackground = useRef(null);

  return (
    <div className="transfer-box" onClick={(e) => {
      if (e.target === modalBackground.current) onCloseTransfer();
    }} ref={modalBackground}>
      <div className="modal">
        <div className="title">
          <h3>Transfer Money</h3>
          <button className="close-modal" onClick={onCloseTransfer}>&times;</button>
        </div>
        <form onSubmit={(e) => {
          handleTransaction(e, "/customer/transfer")
        }}>
          <input
            type="hidden"
            name="account_number_sender"
            value={data.accounts[selectedAccount].account_number}
            readOnly
          />
          <label htmlFor="account_number_recipient">Account Number</label>
          <input type="text" name="account_number_recipient" id="account-number" className="modal-input" onChange={(e) => {
            e.target.value = e.target.value.replace(/\D/g, "");
          }} required />
          <label htmlFor="amount">Amount</label>
          <div className="money-input modal-input">
            <span>₱</span>
            <input
              type="number"
              name="amount"
              min="1"
              step="0.01"
              placeholder="0.00"
              required
            />
          </div>
          <label htmlFor="purpose">Purpose of Transfer</label>
          <input type="text" name="purpose" id="purpose" className="modal-input" />
          <button type="submit" className="btn primary">Send Money</button>
          {(success || data.success) && (
            <div className="alert success">
              {success || data.success}
            </div>
          )}

          {(error || data.error) && (
            <div className="alert error">
              {error || data.error}
            </div>
          )}
        </form>
      </div>
    </div>
  )
}