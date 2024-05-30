import React from 'react';
import Modal from 'react-modal';

import './styles.scss';

type Props = {
    open: boolean;
    children: React.ReactNode;
};

const SiteModal = ({ open, children }: Props) => (
    <Modal
        overlayClassName="modal__overlay"
        className="modal__content"
        isOpen={open}
        ariaHideApp={false}
    >
        {children}
    </Modal>
);

export default SiteModal;
