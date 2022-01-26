import React from 'react';
import MenuItem from 'app/shared/layout/menus/menu-item';
import { Translate, translate } from 'react-jhipster';
import { NavDropdown } from './menu-components';

export const EntitiesMenu = props => (
  <NavDropdown
    icon="th-list"
    name={translate('global.menu.entities.main')}
    id="entity-menu"
    data-cy="entity"
    style={{ maxHeight: '80vh', overflow: 'auto' }}
  >
    <MenuItem icon="asterisk" to="/customer">
      <Translate contentKey="global.menu.entities.customer" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/wallet">
      <Translate contentKey="global.menu.entities.wallet" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/journal-line">
      <Translate contentKey="global.menu.entities.journalLine" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/journal">
      <Translate contentKey="global.menu.entities.journal" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/app-transact">
      <Translate contentKey="global.menu.entities.appTransact" />
    </MenuItem>
    <MenuItem icon="asterisk" to="/biller">
      <Translate contentKey="global.menu.entities.biller" />
    </MenuItem>
    {/* jhipster-needle-add-entity-to-menu - JHipster will add entities to the menu here */}
  </NavDropdown>
);
