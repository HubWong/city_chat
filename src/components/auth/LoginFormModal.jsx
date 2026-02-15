import SlotModal from '../SlotModal';
import LoginCommonForm from './LoginCommonForm';
import { useReduxAuth } from '../../hooks/useReduxAuth';

const LoginFormModal = ({ visible, onCancel }) => {
    const { hideLoginModal } = useReduxAuth();

    return (
        <SlotModal
            title="用户登录"
            open={visible}
            onCancel={onCancel}
        >
            <LoginCommonForm onSuc={hideLoginModal} />
        </SlotModal>
    );
};

export default LoginFormModal;
