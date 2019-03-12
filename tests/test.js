const RTCConnection_ =
  typeof RTCConnection == "undefined"
    ? require("../rtcbot/rtcbot").RTCConnection
    : RTCConnection;
const Queue_ =
  typeof Queue == "undefined" ? require("../rtcbot/rtcbot").Queue : Queue;

const assert =
  typeof chai == "undefined" ? require("chai").assert : chai.assert;

describe("RTCConnection", function() {
  it("should successfully send multiple messages", async function() {
    testmsg1 = "Testy mc test-test";
    testmsg2 = "Hai wrld";

    c1 = new RTCConnection_();
    c2 = new RTCConnection_();

    q1 = new Queue_();
    q2 = new Queue_();
    c1.subscribe(m => q1.put_nowait(m));
    c2.subscribe(m => q2.put_nowait(m));

    offer = await c1.getLocalDescription();
    response = await c2.getLocalDescription(offer);
    await c1.setRemoteDescription(response);

    c1.put_nowait(testmsg1);
    c2.put_nowait(testmsg2);

    c1.put_nowait("OMG");
    c2.put_nowait("OMG2");

    msg1 = await q1.get();
    msg2 = await q2.get();

    assert.equal(msg1, testmsg2);
    assert.equal(msg2, testmsg1);

    msg1 = await q1.get();
    msg2 = await q2.get();

    assert.equal(msg1, "OMG2");
    assert.equal(msg2, "OMG");

    await c1.close();
    await c2.close();

    return 0;
  });
});
