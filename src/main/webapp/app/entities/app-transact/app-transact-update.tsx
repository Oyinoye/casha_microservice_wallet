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
import { getEntity, updateEntity, createEntity, reset } from './app-transact.reducer';
import { IAppTransact } from 'app/shared/model/app-transact.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IAppTransactUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const AppTransactUpdate = (props: IAppTransactUpdateProps) => {
  const [isNew] = useState(!props.match.params || !props.match.params.id);

  const { appTransactEntity, customers, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/app-transact');
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
        ...appTransactEntity,
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
          <h2 id="walletApp.appTransact.home.createOrEditLabel" data-cy="AppTransactCreateUpdateHeading">
            <Translate contentKey="walletApp.appTransact.home.createOrEditLabel">Create or edit a AppTransact</Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : appTransactEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="app-transact-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="app-transact-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="typeLabel" for="app-transact-type">
                  <Translate contentKey="walletApp.appTransact.type">Type</Translate>
                </Label>
                <AvInput
                  id="app-transact-type"
                  data-cy="type"
                  type="select"
                  className="form-control"
                  name="type"
                  value={(!isNew && appTransactEntity.type) || 'WalletTransfer'}
                >
                  <option value="WalletTransfer">{translate('walletApp.TransactionType.WalletTransfer')}</option>
                  <option value="BankTransfer">{translate('walletApp.TransactionType.BankTransfer')}</option>
                  <option value="WalletFunding">{translate('walletApp.TransactionType.WalletFunding')}</option>
                  <option value="BankFunding">{translate('walletApp.TransactionType.BankFunding')}</option>
                  <option value="BillPayment">{translate('walletApp.TransactionType.BillPayment')}</option>
                </AvInput>
              </AvGroup>
              <AvGroup>
                <Label id="transactionDateLabel" for="app-transact-transactionDate">
                  <Translate contentKey="walletApp.appTransact.transactionDate">Transaction Date</Translate>
                </Label>
                <AvField
                  id="app-transact-transactionDate"
                  data-cy="transactionDate"
                  type="date"
                  className="form-control"
                  name="transactionDate"
                />
              </AvGroup>
              <AvGroup>
                <Label id="transactionRefLabel" for="app-transact-transactionRef">
                  <Translate contentKey="walletApp.appTransact.transactionRef">Transaction Ref</Translate>
                </Label>
                <AvField id="app-transact-transactionRef" data-cy="transactionRef" type="text" name="transactionRef" />
              </AvGroup>
              <AvGroup>
                <Label id="descriptionLabel" for="app-transact-description">
                  <Translate contentKey="walletApp.appTransact.description">Description</Translate>
                </Label>
                <AvField id="app-transact-description" data-cy="description" type="text" name="description" />
              </AvGroup>
              <AvGroup>
                <Label for="app-transact-customer">
                  <Translate contentKey="walletApp.appTransact.customer">Customer</Translate>
                </Label>
                <AvInput id="app-transact-customer" data-cy="customer" type="select" className="form-control" name="customerId">
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
              <Button tag={Link} id="cancel-save" to="/app-transact" replace color="info">
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
  appTransactEntity: storeState.appTransact.entity,
  loading: storeState.appTransact.loading,
  updating: storeState.appTransact.updating,
  updateSuccess: storeState.appTransact.updateSuccess,
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

export default connect(mapStateToProps, mapDispatchToProps)(AppTransactUpdate);
