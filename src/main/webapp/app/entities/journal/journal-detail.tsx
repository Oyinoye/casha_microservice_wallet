import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './journal.reducer';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IJournalDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const JournalDetail = (props: IJournalDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { journalEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="journalDetailsHeading">
          <Translate contentKey="walletApp.journal.detail.title">Journal</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{journalEntity.id}</dd>
          <dt>
            <span id="journalID">
              <Translate contentKey="walletApp.journal.journalID">Journal ID</Translate>
            </span>
          </dt>
          <dd>{journalEntity.journalID}</dd>
          <dt>
            <span id="dateOfEntry">
              <Translate contentKey="walletApp.journal.dateOfEntry">Date Of Entry</Translate>
            </span>
          </dt>
          <dd>
            {journalEntity.dateOfEntry ? <TextFormat value={journalEntity.dateOfEntry} type="date" format={APP_LOCAL_DATE_FORMAT} /> : null}
          </dd>
          <dt>
            <span id="description">
              <Translate contentKey="walletApp.journal.description">Description</Translate>
            </span>
          </dt>
          <dd>{journalEntity.description}</dd>
        </dl>
        <Button tag={Link} to="/journal" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/journal/${journalEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ journal }: IRootState) => ({
  journalEntity: journal.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(JournalDetail);
