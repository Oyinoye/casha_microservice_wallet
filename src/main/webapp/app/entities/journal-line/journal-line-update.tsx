import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { Translate, translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { IJournal } from 'app/shared/model/journal.model';
import { getEntities as getJournals } from 'app/entities/journal/journal.reducer';
import { IWallet } from 'app/shared/model/wallet.model';
import { getEntities as getWallets } from 'app/entities/wallet/wallet.reducer';
import { getEntity, updateEntity, createEntity, reset } from './journal-line.reducer';
import { IJournalLine } from 'app/shared/model/journal-line.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IJournalLineUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const JournalLineUpdate = (props: IJournalLineUpdateProps) => {
  const [isNew] = useState(!props.match.params || !props.match.params.id);

  const { journalLineEntity, journals, wallets, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/journal-line');
  };

  useEffect(() => {
    if (isNew) {
      props.reset();
    } else {
      props.getEntity(props.match.params.id);
    }

    props.getJournals();
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
        ...journalLineEntity,
        ...values,
        journal: journals.find(it => it.id.toString() === values.journalId.toString()),
        journal: journals.find(it => it.id.toString() === values.journalId.toString()),
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
          <h2 id="walletApp.journalLine.home.createOrEditLabel" data-cy="JournalLineCreateUpdateHeading">
            <Translate contentKey="walletApp.journalLine.home.createOrEditLabel">Create or edit a JournalLine</Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : journalLineEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="journal-line-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="journal-line-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="amountLabel" for="journal-line-amount">
                  <Translate contentKey="walletApp.journalLine.amount">Amount</Translate>
                </Label>
                <AvField id="journal-line-amount" data-cy="amount" type="string" className="form-control" name="amount" />
              </AvGroup>
              <AvGroup>
                <Label id="typeLabel" for="journal-line-type">
                  <Translate contentKey="walletApp.journalLine.type">Type</Translate>
                </Label>
                <AvInput
                  id="journal-line-type"
                  data-cy="type"
                  type="select"
                  className="form-control"
                  name="type"
                  value={(!isNew && journalLineEntity.type) || 'WalletTransfer'}
                >
                  <option value="WalletTransfer">{translate('walletApp.TransactionType.WalletTransfer')}</option>
                  <option value="BankTransfer">{translate('walletApp.TransactionType.BankTransfer')}</option>
                  <option value="WalletFunding">{translate('walletApp.TransactionType.WalletFunding')}</option>
                  <option value="BankFunding">{translate('walletApp.TransactionType.BankFunding')}</option>
                  <option value="BillPayment">{translate('walletApp.TransactionType.BillPayment')}</option>
                </AvInput>
              </AvGroup>
              <AvGroup>
                <Label id="narrationLabel" for="journal-line-narration">
                  <Translate contentKey="walletApp.journalLine.narration">Narration</Translate>
                </Label>
                <AvField id="journal-line-narration" data-cy="narration" type="text" name="narration" />
              </AvGroup>
              <AvGroup>
                <Label id="operationLabel" for="journal-line-operation">
                  <Translate contentKey="walletApp.journalLine.operation">Operation</Translate>
                </Label>
                <AvInput
                  id="journal-line-operation"
                  data-cy="operation"
                  type="select"
                  className="form-control"
                  name="operation"
                  value={(!isNew && journalLineEntity.operation) || 'Debit'}
                >
                  <option value="Debit">{translate('walletApp.OperationType.Debit')}</option>
                  <option value="Credit">{translate('walletApp.OperationType.Credit')}</option>
                </AvInput>
              </AvGroup>
              <AvGroup>
                <Label for="journal-line-journal">
                  <Translate contentKey="walletApp.journalLine.journal">Journal</Translate>
                </Label>
                <AvInput id="journal-line-journal" data-cy="journal" type="select" className="form-control" name="journalId">
                  <option value="" key="0" />
                  {journals
                    ? journals.map(otherEntity => (
                        <option value={otherEntity.id} key={otherEntity.id}>
                          {otherEntity.journalID}
                        </option>
                      ))
                    : null}
                </AvInput>
              </AvGroup>
              <AvGroup>
                <Label for="journal-line-wallet">
                  <Translate contentKey="walletApp.journalLine.wallet">Wallet</Translate>
                </Label>
                <AvInput id="journal-line-wallet" data-cy="wallet" type="select" className="form-control" name="walletId">
                  <option value="" key="0" />
                  {wallets
                    ? wallets.map(otherEntity => (
                        <option value={otherEntity.id} key={otherEntity.id}>
                          {otherEntity.walletID}
                        </option>
                      ))
                    : null}
                </AvInput>
              </AvGroup>
              <AvGroup>
                <Label for="journal-line-journal">
                  <Translate contentKey="walletApp.journalLine.journal">Journal</Translate>
                </Label>
                <AvInput id="journal-line-journal" data-cy="journal" type="select" className="form-control" name="journalId">
                  <option value="" key="0" />
                  {journals
                    ? journals.map(otherEntity => (
                        <option value={otherEntity.id} key={otherEntity.id}>
                          {otherEntity.journalID}
                        </option>
                      ))
                    : null}
                </AvInput>
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/journal-line" replace color="info">
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
  journals: storeState.journal.entities,
  wallets: storeState.wallet.entities,
  journalLineEntity: storeState.journalLine.entity,
  loading: storeState.journalLine.loading,
  updating: storeState.journalLine.updating,
  updateSuccess: storeState.journalLine.updateSuccess,
});

const mapDispatchToProps = {
  getJournals,
  getWallets,
  getEntity,
  updateEntity,
  createEntity,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(JournalLineUpdate);
