import React from 'react';
import SimpleButton from '../components/SimpleButton';
import styles from '../pages/ChargeSubscription.module.css';
// ^ importuje stejné styly jako ChargeSubscription (pokud nechcete
//   vytvářet novou CSS module speciálně pro tuto komponentu).

function SubscriptionSection({
                                 subscriptionPlans,
                                 loading,
                                 handleOpenSubscriptionModal
                             }) {
    return (
        <div className={styles.subscriptionSection}>
            <h4>Předplatné</h4>
            {subscriptionPlans.length === 0 ? (
                <p>Žádné dostupné předplatné.</p>
            ) : (
                <div className={styles.subscriptionButtons}>
                    {subscriptionPlans.map((plan) => (
                        <SimpleButton
                            key={plan.subscriptionID}
                            text={plan.label}
                            onClick={() => handleOpenSubscriptionModal(plan)}
                            disabled={loading}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default SubscriptionSection;
