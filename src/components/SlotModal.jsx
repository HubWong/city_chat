import { Modal } from 'antd';

const SlotModal = ({
    title,
    open,
    onCancel,
    children,
    width = 520,
    footer = null,
    centered = true,
    bodyStyle,
    ...rest
}) => {
    return (
        <Modal
            title={title}
            open={open}
            onCancel={onCancel}
            footer={footer}
            width={width}
            centered={centered}
            styles={{
                body: {
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    ...bodyStyle,
                },
            }}
            {...rest}
        >
            {children}
        </Modal>
    );
};

export default SlotModal;
