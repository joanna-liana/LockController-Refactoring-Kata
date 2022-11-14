import { MassiveObject } from '../src/IMassiveObject';
import { LockController } from '../src/LockController';
import { Subscription } from '../src/Subscription';
import { createTestDbConnection } from './fixtures';

jest.mock('../src/Subscription');

describe("LockController", () => {
  it("locks and then unlocks", () => {
    // given
    const m = new MassiveObject("Id1");

    const connection = createTestDbConnection();
    const sub = new Subscription(connection.session);
    const controller = new LockController(connection, sub);

    // when, then
    controller.lockObject(m.Id);
    expect(controller.isLocked(m.Id)).toBeTruthy();

    controller.unlockObject(m.Id);
    expect(controller.isLocked(m.Id)).toBeFalsy();

    controller.dispose();
    expect(sub.delete).toHaveBeenCalled();
  })
})
