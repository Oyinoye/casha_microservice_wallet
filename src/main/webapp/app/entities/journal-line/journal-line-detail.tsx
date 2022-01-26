import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './journal-line.reducer';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IJournalLineDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const JournalLineDetail = (props: IJournalLineDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { journalLineEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="journalLineDetailsHeading">
          <Translate contentKey="walletApp.journalLine.detail.title">JournalLine</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{journalLineEntity.id}</dd>
          <dt>
            <span id="amount">
              <Translate contentKey="walletApp.journalLine.amount">Amount</Translate>
            </span>
          </dt>
          <dd>{journalLineEntity.amount}</dd>
          <dt>
            <span id="type">
              <Translate contentKey="walletApp.journalLine.type">Type</Translate>
            </span>
          </dt>
          <dd>{journalLineEntity.type}</dd>
          <dt>
            <span id="narration">
              <Translate contentKey="walletApp.journalLine.narration">Narration</Translate>
            </span>
          </dt>
          <dd>{journalLineEntity.narration}</dd>
          <dt>
            <span id="operation">
              <Translate contentKey="walletApp.journalLine.operation">Operation</Translate>
            </span>
          </dt>
          <dd>{journalLineEntity.operation}</dd>
          <dt>
            <Translate contentKey="walletApp.journalLine.journal">Journal</Translate>
          </dt>
          <dd>{journalLineEntity.journal ? journalLineEntity.journal.journalID : ''}</dd>
          <dt>
            <Translate contentKey="walletApp.journalLine.wallet">Wallet</Translate>
          </dt>
          <dd>{journalLineEntity.wallet ? journalLineEntity.wallet.walletID : ''}</dd>
          <dt>
            <Translate contentKey="walletApp.journalLine.journal">Journal</Translate>
          </dt>
          <dd>{journalLineEntity.journal ? journalLineEntity.journal.journalID : ''}</dd>
        </dl>
        <Button tag={Link} to="/journal-line" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/journal-line/${journalLineEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ journalLine }: IRootState) => ({
  journalLineEntity: journalLine.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(JournalLineDetail);
