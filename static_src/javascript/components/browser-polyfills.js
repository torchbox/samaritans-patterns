if (!Element.prototype.toggleAttribute) {
    Element.prototype.toggleAttribute = function (name, force) {
        if (force !== void 0) {
            force = !!force;
        }

        if (this.getAttribute(name) !== null) {
            if (force) {
                return true;
            }

            this.removeAttribute(name);
            return false;
        } else {
            if (force === false) {
                return false;
            }

            this.setAttribute(name, '');
            return true;
        }
    };
}
