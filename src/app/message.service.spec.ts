import {MessageService} from './message.service';

describe('MessageService', () => {
  it('should have no message to start', () => {
    let service = new MessageService();

    expect(service.messages.length).toBe(0);
  });

  it('should add a message when add is called', () => {
    let service = new MessageService();

    service.add('message1');

    expect(service.messages.length).toBe(1);
  });

  it('should remove all messages when clear is called', () => {
    let service = new MessageService();
    service.add('message1');

    service.clear();

    expect(service.messages.length).toBe(0);
  });
});
