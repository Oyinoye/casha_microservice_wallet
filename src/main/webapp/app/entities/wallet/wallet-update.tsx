import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { Translate, translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { ICustomer } from 'app/shared/model/customer.model';
import { getEntities as getCustomers } from 'app/entities/customer/customer.reducer';
import { getEntity, updateEntity, createEntity, reset } from './wallet.reducer';
import { IWallet } from 'app/shared/model/wallet.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IWalletUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const WalletUpdate = (props: IWalletUpdateProps) => {
  const [isNew] = useState(!props.match.params || !props.match.params.id);

  const { walletEntity, customers, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/wallet');
  };

  useEffect(() => {
    if (isNew) {
      props.reset();
    } else {
      props.getEntity(props.match.params.id);
    }

    props.getCustomers();
  }, []);

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const saveEntity = (event, errors, values) => {
    if (errors.length === 0) {
      const entity = {
        ...walletEntity,
        ...values,
        customer: customers.find(it => it.id.toString() === values.customerId.toString()),
      };

      if (isNew) {
        props.createEntity(entity);
      } else {
        props.updateEntity(entity);
      }
    }
  };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="walletApp.wallet.home.createOrEditLabel" data-cy="WalletCreateUpdateHeading">
            <Translate contentKey="walletApp.wallet.home.createOrEditLabel">Create or edit a Wallet</Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : walletEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="wallet-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="wallet-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="walletIDLabel" for="wallet-walletID">
                  <Translate contentKey="walletApp.wallet.walletID">Wallet ID</Translate>
                </Label>
                <AvField id="wallet-walletID" data-cy="walletID" type="text" name="walletID" />
              </AvGroup>
              <AvGroup>
                <Label id="nubanLabel" for="wallet-nuban">
                  <Translate contentKey="walletApp.wallet.nuban">Nuban</Translate>
                </Label>
                <AvField id="wallet-nuban" data-cy="nuban" type="text" name="nuban" />
              </AvGroup>
              <AvGroup>
                <Label id="accountNumberLabel" for="wallet-accountNumber">
                  <Translate contentKey="walletApp.wallet.accountNumber">Account Number</Translate>
                </Label>
                <AvField id="wallet-accountNumber" data-cy="accountNumber" type="text" name="accountNumber" />
              </AvGroup>
              <AvGroup>
                <Label id="balanceLabel" for="wallet-balance">
                  <Translate contentKey="walletApp.wallet.balance">Balance</Translate>
                </Label>
                <AvField id="wallet-balance" data-cy="balance" type="string" className="form-control" name="balance" />
              </AvGroup>
              <AvGroup>
                <Label id="expiryDateLabel" for="wallet-expiryDate">
                  <Translate contentKey="walletApp.wallet.expiryDate">Expiry Date</Translate>
                </Label>
                <AvField id="wallet-expiryDate" data-cy="expiryDate" type="date" className="form-control" name="expiryDate" />
              </AvGroup>
              <AvGroup>
                <Label id="typeLabel" for="wallet-type">
                  <Translate contentKey="walletApp.wallet.type">Type</Translate>
                </Label>
                <AvInput
                  id="wallet-type"
                  data-cy="type"
                  type="select"
                  className="form-control"
                  name="type"
                  value={(!isNew && walletEntity.type) || 'BonusWallet'}
                >
                  <option value="BonusWallet">{translate('walletApp.WalletType.BonusWallet')}</option>
                  <option value="CustomerWallet">{translate('walletApp.WalletType.CustomerWallet')}</option>
                  <option value="BillerWallet">{translate('walletApp.WalletType.BillerWallet')}</option>
                  <option value="SystemWallet">{translate('walletApp.WalletType.SystemWallet')}</option>
                </AvInput>
              </AvGroup>
              <AvGroup>
                <Label id="statusLabel" for="wallet-status">
                  <Translate contentKey="walletApp.wallet.status">Status</Translate>
                </Label>
                <AvInput
                  id="wallet-status"
                  data-cy="status"
                  type="select"
                  className="form-control"
                  name="status"
                  value={(!isNew && walletEntity.status) || 'Inactive'}
                >
                  <option value="Inactive">{translate('walletApp.WalletStatus.Inactive')}</option>
                  <option value="Active">{translate('walletApp.WalletStatus.Active')}</option>
                  <option value="Blocked">{translate('walletApp.WalletStatus.Blocked')}</option>
                  <option value="Suspended">{translate('walletApp.WalletStatus.Suspended')}</option>
                </AvInput>
              </AvGroup>
              <AvGroup>
                <Label for="wallet-customer">
                  <Translate contentKey="walletApp.wallet.customer">Customer</Translate>
                </Label>
                <AvInput id="wallet-customer" data-cy="customer" type="select" className="form-control" name="customerId">
                  <option value="" key="0" />
                  {customers
                    ? customers.map(otherEntity => (
                        <option value={otherEntity.id} key={otherEntity.id}>
                          {otherEntity.customerID}
                        </option>
                      ))
                    : null}
                </AvInput>
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/wallet" replace color="info">
                <FontAwesomeIcon icon="arrow-left" />
                &nbsp;
                <span className="d-none d-md-inline">
                  <Translate contentKey="entity.action.back">Back</Translate>
                </span>
              </Button>
              &nbsp;
              <Button color="primary" id="save-entity" data-cy="entityCreateSaveButton" type="submit" disabled={updating}>
                <FontAwesomeIcon icon="save" />
                &nbsp;
                <Translate contentKey="entity.action.save">Save</Translate>
              </Button>
            </AvForm>
          )}
        </Col>
      </Row>
    </div>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  customers: storeState.customer.entities,
  walletEntity: storeState.wallet.entity,
  loading: storeState.wallet.loading,
  updating: storeState.wallet.updating,
  updateSuccess: storeState.wallet.updateSuccess,
});

const mapDispatchToProps = {
  getCustomers,
  getEntity,
  updateEntity,
  createEntity,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(WalletUpdate);
