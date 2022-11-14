import { IMassiveDbConnection } from '../src/IMassiveDbConnection';
import { LockControllerFactory } from '../src/LockControllerFactory';
import { createTestDbConnection } from './fixtures';

jest.mock('../src/Subscription');

describe("LockControllerFactory", () => {
  it("creates a controller with an enabled subscription", () => {
    const connection: IMassiveDbConnection = createTestDbConnection();

    const controller = LockControllerFactory.createWith(connection);

    expect(controller.isSubscriptionActive()).toBeTruthy();
  })
})
