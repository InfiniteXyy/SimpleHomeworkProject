package cn.infinitex.simplehomework;

public class ThrowableCapter {

  @FunctionalInterface
  public interface Actor {

    void act() throws Throwable;
  }

  public static Throwable thrownBy(Actor actor) {
    try {
      actor.act();
    } catch (Throwable throwable) {
      return throwable;
    }
    return null;
  }

}