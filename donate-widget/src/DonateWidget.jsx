import React, { useState } from 'react';
import _ from 'lodash';
import { format } from 'date-fns';

const PRESET_AMOUNTS = [10, 25, 50, 100];

export default function DonateWidget() {
    const [amount, setAmount] = useState(25);
    const [customAmount, setCustomAmount] = useState('');
    const [frequency, setFrequency] = useState('one-time');
    const [submitting, setSubmitting] = useState(false);
    const [thanks, setThanks] = useState(false);
    const [error, setError] = useState('');
    const [donatedAt, setDonatedAt] = useState(null);

    const isCustom = amount === 'custom';
    const effectiveAmount = isCustom
        ? _.clamp(Number(customAmount) || 0, 0, 10000)
        : amount;

    function handlePresetClick(value) {
        setAmount(value);
        setCustomAmount('');
        setError('');
    }

    function handleCustomChange(e) {
        setCustomAmount(e.target.value);
        setAmount('custom');
        setError('');
    }

    function handleSubmit(e) {
        e.preventDefault();
        if (!effectiveAmount || effectiveAmount <= 0) {
            setError('Please enter an amount greater than $0.');
            return;
        }
        if (effectiveAmount > 10000) {
            setError('For donations over $10,000 please contact us directly.');
            return;
        }
        setSubmitting(true);
        // Fake processing delay — no real payment integration yet.
        setTimeout(() => {
            setSubmitting(false);
            setDonatedAt(new Date());
            setThanks(true);
        }, 600);
    }

    function handleReset() {
        setThanks(false);
        setAmount(25);
        setCustomAmount('');
        setFrequency('one-time');
        setError('');
    }

    if (thanks) {
        return (
            <div className="pp-donate">
                <div className="pp-donate__thanks">
                    <h3>Thanks so much!</h3>
                    <p>
                        Your {frequency === 'monthly' ? 'monthly' : 'one-time'} pledge of{' '}
                        <strong>${effectiveAmount}</strong> means a lot. You'll get a confirmation
                        email shortly.
                    </p>
                    <p className="pp-donate__small">
                        Logged {donatedAt ? format(donatedAt, "d MMM yyyy 'at' h:mm a") : 'just now'}.
                        (No payment was actually taken — we're still wiring up the payment provider.)
                    </p>
                    <button type="button" className="pp-donate__link" onClick={handleReset}>
                        Make another donation
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="pp-donate">
            <form onSubmit={handleSubmit} noValidate>
                <fieldset className="pp-donate__frequency">
                    <legend>How often?</legend>
                    <label>
                        <input
                            type="radio"
                            name="frequency"
                            value="one-time"
                            checked={frequency === 'one-time'}
                            onChange={() => setFrequency('one-time')}
                        />
                        <span>One-time</span>
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="frequency"
                            value="monthly"
                            checked={frequency === 'monthly'}
                            onChange={() => setFrequency('monthly')}
                        />
                        <span>Monthly</span>
                    </label>
                </fieldset>

                <fieldset className="pp-donate__amounts">
                    <legend>Amount (AUD)</legend>
                    <div className="pp-donate__presets">
                        {PRESET_AMOUNTS.map((preset) => (
                            <button
                                key={preset}
                                type="button"
                                className={
                                    'pp-donate__preset' +
                                    (amount === preset ? ' is-selected' : '')
                                }
                                onClick={() => handlePresetClick(preset)}
                            >
                                ${preset}
                            </button>
                        ))}
                    </div>
                    <label className="pp-donate__custom">
                        <span>Or enter a custom amount:</span>
                        <input
                            type="number"
                            inputMode="decimal"
                            min="1"
                            step="1"
                            placeholder="$"
                            value={customAmount}
                            onChange={handleCustomChange}
                        />
                    </label>
                </fieldset>

                {error && <p className="pp-donate__error" role="alert">{error}</p>}

                <button type="submit" disabled={submitting}>
                    {submitting
                        ? 'Processing…'
                        : `Donate $${effectiveAmount || 0}${frequency === 'monthly' ? '/mo' : ''}`}
                </button>

                <p className="pp-donate__small">
                    Pantry Perth is a registered Australian charity. Donations over $2 are
                    tax-deductible.
                </p>
            </form>
        </div>
    );
}
