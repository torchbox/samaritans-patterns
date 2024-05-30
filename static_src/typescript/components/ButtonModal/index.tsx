import React from 'react';

import Modal from 'components/Modal';

type Props = {
    buttons: React.ReactNode | React.ReactNode[];
    title: string;
    open: boolean;
};

const ButtonModal = ({ buttons, title, open }: Props) => (
    <Modal open={open}>
        <div className="modal">
            <h3 className="modal__heading">{title}</h3>
            <div className="modal__buttons">{buttons}</div>
        </div>
    </Modal>
);

export default ButtonModal;
