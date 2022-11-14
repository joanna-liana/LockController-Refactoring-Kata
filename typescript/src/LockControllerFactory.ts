import { IMassiveDbConnection } from './IMassiveDbConnection';
import { LockController } from './LockController';
import { MassiveDataChangedEvent } from './MassiveDataChangedEvent';
import { Subscription } from './Subscription';

export class LockControllerFactory {
  private readonly _subscription: Subscription;
  private readonly _controller: LockController;

  private constructor(_connection: IMassiveDbConnection) {
    this._subscription = new Subscription(_connection.session);
    this._subscription.publishingEnabled = true;
    this._subscription.publishingInterval = 500;
    this._subscription.create();

    this._controller = new LockController(_connection, this._subscription);

    this._subscription.registerCallback(this.subscriptionDataChange.bind(this));
  }

  static createWith(_connection: IMassiveDbConnection) {
    const manager = new LockControllerFactory(_connection);

    return manager._controller;
  }

  /**
   * This is called by the Massive Database when data is changed,
   * because we registered it as a callback earlier.
   */
  private subscriptionDataChange(subscription: Subscription, e: MassiveDataChangedEvent) {
    const mObjectId = e.mid;

    if (e.type == "Lock") {
      this._controller.lockObject(mObjectId);
    }
    else if (e.type == "Unlock") {
      this._controller.unlockObject(mObjectId);
    }
  }
}
