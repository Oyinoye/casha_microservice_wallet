import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { Translate, translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { IWallet } from 'app/shared/model/wallet.model';
import { getEntities as getWallets } from 'app/entities/wallet/wallet.reducer';
import { getEntity, updateEntity, createEntity, reset } from './biller.reducer';
import { IBiller } from 'app/shared/model/biller.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IBillerUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const BillerUpdate = (props: IBillerUpdateProps) => {
  const [isNew] = useState(!props.match.params || !props.match.params.id);

  const { billerEntity, wallets, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/biller');
  };

  useEffect(() => {
    if (isNew) {
      props.reset();
    } else {
      props.getEntity(props.match.params.id);
    }

    props.getWallets();
  }, []);

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const saveEntity = (event, errors, values) => {
    if (errors.length === 0) {
      const entity = {
        ...billerEntity,
        ...values,
        wallet: wallets.find(it => it.id.toString() === values.walletId.toString()),
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
          <h2 id="walletApp.biller.home.createOrEditLabel" data-cy="BillerCreateUpdateHeading">
            <Translate contentKey="walletApp.biller.home.createOrEditLabel">Create or edit a Biller</Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : billerEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="biller-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="biller-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="nameLabel" for="biller-name">
                  <Translate contentKey="walletApp.biller.name">Name</Translate>
                </Label>
                <AvField id="biller-name" data-cy="name" type="text" name="name" />
              </AvGroup>
              <AvGroup>
                <Label id="descriptionLabel" for="biller-description">
                  <Translate contentKey="walletApp.biller.description">Description</Translate>
                </Label>
                <AvField id="biller-description" data-cy="description" type="text" name="description" />
              </AvGroup>
              <AvGroup>
                <Label for="biller-wallet">
                  <Translate contentKey="walletApp.biller.wallet">Wallet</Translate>
                </Label>
                <AvInput id="biller-wallet" data-cy="wallet" type="select" className="form-control" name="walletId">
                  <option value="" key="0" />
                  {wallets
                    ? wallets.map(otherEntity => (
                        <option value={otherEntity.id} key={otherEntity.id}>
                          {otherEntity.accountNumber}
                        </option>
                      ))
                    : null}
                </AvInput>
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/biller" replace color="info">
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
  wallets: storeState.wallet.entities,
  billerEntity: storeState.biller.entity,
  loading: storeState.biller.loading,
  updating: storeState.biller.updating,
  updateSuccess: storeState.biller.updateSuccess,
});

const mapDispatchToProps = {
  getWallets,
  getEntity,
  updateEntity,
  createEntity,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(BillerUpdate);
