import { useState, useEffect } from 'react'
import { useReduxPay } from '../hooks/useReduxPay';
import styles from './PayQrModal.module.css'

const PayQrModal = ( ) => {
    const { createOrder, order,payVisible : visible} = useReduxPay()
    const [selectedToken, setSelectedToken] = useState('USDT');
    const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes in seconds

    // 倒计时逻辑
    useEffect(() => {
        let timer;
        if (visible && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            // 倒计时结束，可触发回调（如取消订单）
        }
        return () => clearInterval(timer);
    }, [visible, timeLeft]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const currentAddress = order?.qr;
    //const currentAddress = paymentAddresses[selectedToken];

    if (!visible) return null;

    return (
        <div className={styles.overlay} onClick={() => createOrder(null)}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <button className={styles.closeButton} onClick={() => createOrder(null)}>×</button>
                <h2 className={styles.title}>加密货币支付</h2>

                <div className={styles.tokenSelector}>
                    <label className={styles.label}>选择支付币种：</label>
                    <div className={styles.tokenButtons}>
                        <button
                            className={`${styles.tokenButton} ${selectedToken === 'USDT' ? styles.active : ''}`}
                            // onClick={() => setSelectedToken('USDT')}
                        >
                            USDT (ERC-20)
                        </button>
                        <button
                            className={`${styles.tokenButton} ${selectedToken === 'USDC' ? styles.active : ''}`}
                            //onClick={() => setSelectedToken('USDC')}
                        >
                            USDC (ERC-20)
                        </button>
                    </div>
                </div>

                <div className={styles.paymentInfo}>
                    <p className={styles.countdownLabel}>支付倒计时：</p>
                    <p className={styles.countdown}>{formatTime(timeLeft)}</p>
                    {timeLeft === 0 && <p className={styles.expired}>支付已过期</p>}
                </div>

                <div className={styles.qrSection}>
                    <p className={styles.addressLabel}>请向以下地址支付：</p>
                    <div className={styles.qrWrapper}>
                        {/* <QRCodeSVG value={currentAddress} size={180} /> */}
                        <img alt="" src={currentAddress} style={{ 'width': '180px' }} />
                    </div>
                    <p className={styles.address}>to:{order?.pay_address}</p>
                    <p className={styles.address}>合约:{order?.contract}</p>
                    <p className={styles.tip}>⚠️ 请确保网络为 {order?.chain}</p>
                </div>

                <div className={styles.footer}>
                    <p>支付后请等待网络确认（通常 1-2 分钟）</p>
                </div>
            </div>
        </div>
    );

}

export default PayQrModal
